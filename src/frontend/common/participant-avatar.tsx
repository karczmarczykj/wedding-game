import React, { forwardRef } from 'react';
import { transform, ParticipantState } from '@frontend/common/game-state';
import styles from './participant-avatar.module.scss';

type AvatarProps = {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  participant: ParticipantState;
  size: number;
} & React.ComponentPropsWithoutRef<'div'>;

const ParticipantAvatar  = forwardRef<HTMLDivElement, AvatarProps>(({Icon, participant, size}, ref) => {
  const { x, y } = transform(participant.position);

  return (
    <div
      className={styles.avatar}
      style={{ transform: `translate(${x}px, ${y}px)` }}
      ref={ref}
    >
      <Icon width={size} height={size} />
      <p>{participant.name}</p>
      <p className={styles.avatarPoints + ' avatarPoints'}>{participant.points}</p>
    </div>
  );
});

export default ParticipantAvatar;
