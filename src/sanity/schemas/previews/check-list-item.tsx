import { CheckCircledIcon } from '@radix-ui/react-icons';
import type { PropsWithChildren } from 'react';

export function CheckListItem(props: PropsWithChildren) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4em' }}>
      <CheckCircledIcon
        style={{
          width: '0.9em',
          height: '0.9em',
          opacity: 0.5,
          flexShrink: 0,
        }}
      />
      <span>{props.children}</span>
    </div>
  );
}
