import React, { createContext, useContext, useState, useCallback } from 'react';

interface AccessibilityContextType {
  isScreenReaderEnabled: boolean;
  toggleScreenReader: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);

  const speak = useCallback((text: string) => {
    if (isScreenReaderEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  }, [isScreenReaderEnabled]);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const toggleScreenReader = useCallback(() => {
    setIsScreenReaderEnabled(prev => {
      const newValue = !prev;
      if (newValue) {
        speak('Lector de pantalla activado');
      } else {
        stopSpeaking();
      }
      return newValue;
    });
  }, [speak, stopSpeaking]);

  const value = {
    isScreenReaderEnabled,
    toggleScreenReader,
    speak,
    stopSpeaking
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}