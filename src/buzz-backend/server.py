import logging
from websocket_server import WebsocketServer, logger
import hid
import logging
import signal
import re
import threading
from time import sleep

clients = []
pad_devices = {}
general_lock = threading.RLock()
lights_re = re.compile(r'Lights\s*:\s*\[(.*)\]')

def update_pad_devices():
    devices_to_remove = set(pad_devices.keys())
    device_config_changed = False
    for device in hid.enumerate():
        if device['vendor_id'] == 0x054C and device['product_id'] in [0x1000, 0x0002, 0x0003]:
            logger.log(logging.INFO, f"Device: {device['product_string']}")
            device_path = device['path']
            if not device_path in pad_devices:
                logger.log(logging.INFO, f"New device: {device_path}")
                device_config_changed = True
            else:
                devices_to_remove = [value for value in devices_to_remove if value != device_path]
            try:
                pad_devices.update({device_path : hid.Device(device['vendor_id'], device['product_id'], device['serial_number'], device_path)})
                pad_devices[device_path].nonblocking = True
            except Exception as e:
                logger.log(logging.INFO, f"Can't open device {device_path}: {e}")
                continue

    for path in devices_to_remove:
        logger.log(logging.INFO, f"Removing device: {path}")
        pad_devices.pop(path)
        device_config_changed = True

    if (device_config_changed):
        logger.log(logging.INFO, f"Controller configuration changed")

    return device_config_changed


def send_buffers(buffers):
    logger.log(logging.INFO, f"Current buffers: {buffers}")
    index = 0
    for path, device in pad_devices.items():
        to_send = b''.join(buffers[index])
        device.write(to_send)
        index += 1
        logger.log(logging.INFO, f"Sending buffer index {path}:{to_send}")

def set_lights(lights_array):
    lights_controller_list = [ [b'\x00'] * 8 for i in range(len(pad_devices))]
    for id in lights_array:
        (major, minor) = divmod(id, 4)
        logger.log(logging.INFO, f"Lights major:{major}, minor:{minor}")
        if (major > len(lights_controller_list)):
            logger.log(logging.INFO, f"Can't light controller {id} out of bound")
            continue
        lights_controller_list[major][minor + 2] = b'\xff'
    send_buffers(lights_controller_list)



def message_received(client, server, message):
    general_lock.acquire(blocking=True)
    update_pad_devices()
    lights_array = lights_re.match(message)
    if ((not (lights_array is None)) and len(lights_array.groups()) > 0):
        try:
            lights_array = lights_array.group(1).split(',')
            lights_array = list(map(int, lights_array))
            lights_array = sorted(set(lights_array))
            logger.log(logging.INFO, f"Recieved command Lights: {lights_array}")
        except:
            logger.log(logging.ERROR, f"Can't parse pads numbers {lights_array}")
            set_lights([])
            general_lock.release()
            return
        set_lights(lights_array)
        general_lock.release()
        return 

    logger.log(logging.WARNING, f"Unknown command: {message}")
    general_lock.release()


def new_client(client, server):
    general_lock.acquire(blocking=True)
    clients.append(client)
    update_pad_devices()
    controllers = len(pad_devices) * 4
    logger.log(logging.INFO, f"New client: {client['address']}")
    try:
        server.send_message(client, f"\"pads_cnt\": {controllers}")
    except:
        logger.log(logging.ERROR, f"Can't send pads count to client {client['address']}")
        general_lock.release()
        return
    general_lock.release()

def client_left(client, server):
    general_lock.acquire(blocking=True)
    try:
        clients.remove(client)
    except:
        logger.log(logging.ERROR, f"Can't remove client")
        general_lock.release()
        return
    logger.log(logging.INFO, f"Client disconnected: {client['address']}")
    general_lock.release()

def interrupt(signum, frame):
    server.disconnect_clients_gracefully()
    logger.log(logging.INFO, f"Server recieved Ctrl+C")
    logger.log(logging.INFO, f"Shouting down")
    exit(0)


signal.signal(signal.SIGINT, interrupt)


server = WebsocketServer(host='127.0.0.1', port=13254, loglevel=logging.INFO)
server.set_fn_new_client(new_client)
server.set_fn_message_received(message_received)
server.set_fn_client_left(client_left)
server.run_forever(True)

def decode_buttons(controller_index, buttons_codes):
    byte_codes = bytearray(buttons_codes)
    retval = []
    if (len(byte_codes ) > 4):
        buttons = int.from_bytes(byte_codes[2:5], 'little')
        buttons_array = list(f"0b{buttons:016b}")[::-1]
        index = 0
        buttons_tags = ['R', 'D', 'C', 'B', 'A']
        for state in buttons_array[0:20]:
            if state == '1':
                (subindex, tag_code) = divmod(index, 5)
                retval.append(f"\"{controller_index * 4 + subindex}\": \"{buttons_tags[tag_code]}\"")
            index += 1
    return retval


def check_buttons():
    index = 0
    pushed_buttons = []
    button_changed = False
    for path, device in pad_devices.items():
        buttons_codes = device.read(64)
        if buttons_codes != b'':
            pushed_buttons += decode_buttons(index, buttons_codes)
            button_changed = True
        index += 1
    if len(pushed_buttons) == 0 and button_changed:
        pushed_buttons = ['Release']
    return pushed_buttons

prev_buttons = []
while True:
    general_lock.acquire(blocking=True)
    current_buttons = check_buttons()
    if current_buttons != prev_buttons:
        if len(current_buttons) > 0:
            logger.log(logging.INFO, f"Buttons: {current_buttons}")
            server.send_message_to_all(", ".join(current_buttons))
        prev_buttons = current_buttons
    general_lock.release()
    sleep(0.05)
