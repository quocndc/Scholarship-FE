import AlertDialog from '@components/tailus-ui/AlertDialog';
import Button from '@components/tailus-ui/Button';
import { createContext, useCallback, useContext, useRef, useState } from 'react';

type DialogFnProps = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
};
type ConfirmDialogContextType = {
  dialog: (props: DialogFnProps) => Promise<boolean>;
};
const ConfirmDialogContext = createContext<ConfirmDialogContextType | undefined>(undefined);

export const usePromt = () => {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error('usePromt must be used within a ConfirmDialogProvider');
  }
  return context;
};

type ConfirmState = {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

export const ConfirmDialogProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [state, setState] = useState<ConfirmState>({
    isOpen: false,
    title: '',
    description: '',
    confirmLabel: 'Xác nhận',
    cancelLabel: 'Huỷ',
  });

  const fnRef = useRef<(choice: boolean) => void>();

  const dialog = useCallback((props: DialogFnProps) => {
    return new Promise<boolean>((resolve) => {
      setState({
        ...props,
        isOpen: true,
      });
      fnRef.current = (choice) => {
        resolve(choice);
        setState((prev) => ({ ...prev, isOpen: false }));
      };
    });
  }, []);

  return (
    <ConfirmDialogContext.Provider value={{ dialog }}>
      <AlertDialog.Root
        open={state.isOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            fnRef.current?.(false);
          }
        }}
      >
        <AlertDialog.Portal>
          <AlertDialog.Overlay />
          <AlertDialog.Content className="max-w-sm" data-shade="800">
            <AlertDialog.Title>{state.title}</AlertDialog.Title>
            <AlertDialog.Description className="mt-2">{state.description}</AlertDialog.Description>
            <AlertDialog.Actions>
              <AlertDialog.Cancel asChild>
                <Button.Root variant="outlined" intent="gray" size="sm" onClick={() => fnRef.current?.(false)}>
                  <Button.Label>{state.cancelLabel}</Button.Label>
                </Button.Root>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button.Root variant="solid" intent="danger" size="sm" onClick={() => fnRef.current?.(true)}>
                  <Button.Label>{state.confirmLabel}</Button.Label>
                </Button.Root>
              </AlertDialog.Action>
            </AlertDialog.Actions>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
      {children}
    </ConfirmDialogContext.Provider>
  );
};
