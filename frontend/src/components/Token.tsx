import { Dialog, Transition } from "@headlessui/react";
import { FaAngleDown } from "react-icons/fa";
import { Fragment, useState } from "react";

export interface ISelect {
  onClick: () => void;
  selectedToken: Token | undefined;
}

export interface Token {
  id: number;
  name: string;
  symbol: string;
  address: string;
}

export interface ITokenModal {
  selectedToken: Token | undefined;
}

export function TokenButton({ onClick, selectedToken }: ISelect) {
    if (selectedToken) {
        return (
          <button onClick={onClick} className={`tokenSelectButton`}>
            <div>{selectedToken.symbol}</div>
            <FaAngleDown />
          </button>
        );
    } else {
        return (
            <button onClick={onClick} className={`tokenSelectButton`}>
                <div>Select token</div>
                <FaAngleDown />
            </button>
        )
    }
}

export default function TokenModal({ selectedToken }: ITokenModal) {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    console.log("closeModal");
    setIsOpen(false);
  }

  function openModal() {
    console.log("openModal");
    setIsOpen(true);
  }

  return (
    <>
      <TokenButton
        selectedToken={selectedToken}
        onClick={() => {
          console.log("TokenButton clicked");
          openModal();
        }}
      />

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="modal" onClose={closeModal}>
          <div className="modalOverlay" />
          <div className="modalContainer">
            <Dialog.Title as="h3" className="modalTitle">
              Select a Token
            </Dialog.Title>
            <div className="modalContent">Not implemented</div>
            <div className="modalActions">
              <button onClick={closeModal} className="modalCloseButton">
                Close
              </button>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}