// src/components/ui/Modal.tsx
"use client";
import React, { useState, useEffect, use } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none'>
      <div className='relative w-auto max-w-3xl mx-auto my-6'>
        <div className='relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none'>
          <div className='flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200'>
            <h3 className='text-2xl font-semibold'>{title}</h3>
            <button
              className='p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none'
              onClick={onClose}
            >
              <X size={24} />
            </button>
          </div>
          <div className='relative p-6 flex-auto'>{children}</div>
        </div>
      </div>
      <div
        className='fixed inset-0 z-40 bg-black opacity-25'
        onClick={onClose}
      ></div>
    </div>
  );
}
