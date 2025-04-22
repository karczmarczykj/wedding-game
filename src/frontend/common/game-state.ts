export interface RadiusPosition {
  radius: number;
  angle: number;
}

export interface BallState {
  position: RadiusPosition;
  reversed: boolean;
  speedAngle: number;
  speedRadial: number;
}

export interface ParticipantState {
  position: RadiusPosition;
  padId: number;
  name: string;
  points: number;
  angleSpeed: number;
  radialSpeed: number;
}

export interface GameState {
  ball: BallState;
  participants: Record<string, ParticipantState>;
}

export function createDefaultGameState(): GameState {
  return {
    ball: {
      position: { radius: 50, angle: 0 },
      reversed: false,
      speedAngle: 2,
      speedRadial: 1,
    },
    participants: {},
  };
}

export function createDefaultParticipantState(name: string, radius: number, index: number, count: number, padId: number): ParticipantState {
  let angle = 2 * index * Math.PI / count;
  return {
    position: { radius, angle },
    padId,
    name,
    points: 0,
    angleSpeed: 0,
    radialSpeed: 0,
  };
}

export function transform(Position: RadiusPosition): { x: number; y: number } {
  return {
    x: Position.radius * Math.cos(Position.angle),
    y: Position.radius * Math.sin(Position.angle),
  };
}

function getRadiusPosition(position: RadiusPosition | BallState | ParticipantState): RadiusPosition {
  if ('position' in position) {
    return position.position;
  }
  return position;
}

export function isCollision(a: RadiusPosition | BallState | ParticipantState, b: RadiusPosition | BallState | ParticipantState, minDistance: number) : boolean {
  let aPos = getRadiusPosition(a);
  let bPos = getRadiusPosition(b);
  const deltaX = aPos.radius * Math.cos(aPos.angle) - bPos.radius * Math.cos(bPos.angle);
  const deltaY = aPos.radius * Math.sin(aPos.angle) - bPos.radius * Math.sin(bPos.angle);
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const collisionDistance =1.3 *  minDistance;
  return distance < collisionDistance;
}


