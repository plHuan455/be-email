import create from 'zustand';
import React from 'react';
import { ReceiverData, UserInfo } from '@components/organisms/Email/Interface';

export interface EmailState {
  sender: UserInfo | null;
  receivers: ReceiverData[];

  clearReceivers: () => void;
  pushReceivers: (receiver: ReceiverData) => void;
  deleteReceivers: (index: number) => void;
  setNewReceivers: (receivers: ReceiverData[]) => void;
}

const useEmail = create<EmailState>((set) => ({
  sender: new UserInfo('', 'Giang', 'giang@mail.com'),
  receivers: [],

  clearReceivers() {
    return set((state) => ({ receivers: [] }));
  },
  pushReceivers(receiver) {
    return set((state) => ({
      receivers: [...state.receivers, receiver],
    }));
  },
  deleteReceivers(index) {
    return set((state) => ({
      receivers: state.receivers.splice(index, 1),
    }));
  },
  setNewReceivers(receivers) {
    return set((state) => ({
      receivers: receivers,
    }));
  },
}));

export default useEmail;
