import React, { useEffect, useRef } from 'react';
import { ProductGridCard } from './BAPCards/ProductGridCard';
import { CashbackRadarCard } from './BAPCards/CashbackRadarCard';
import { useAppContext } from './AppContext';
// import { MessageSimple } from 'stream-chat-react'; // Uncomment when stream is installed

interface CustomMessageUIProps {
  message: any; // Type with StreamChat MessageResponse
  isMyMessage: () => boolean;
}

export const CustomMessageUI: React.FC<CustomMessageUIProps> = (props) => {
  const { message, isMyMessage } = props;
  
  // To avoid crash if AppContext is not yet wrapped globally
  let themeSetter = (v: string) => {};
  let langSetter = (v: string) => {};
  let drawerSetter = (v: string) => {};
  let drawerPusher = (v: string) => {};
  let personaSetter = (v: string) => {};
  let notificationsSetter = (v: boolean) => {};
  let currencySetter = (v: string) => {};
  let memoryClearer = () => {};
  let checkInPerformer = (v: boolean) => {};
  let t = (key: string) => key;
  
  try {
    const { setTheme, setLanguage, setActiveDrawer, pushDrawer, setAiPersona, setAiMemoryTags, setNotifications, setCurrency, setHasCheckedInToday, t: tFromContext } = useAppContext() as any;
    themeSetter = setTheme;
    langSetter = setLanguage;
    drawerSetter = setActiveDrawer;
    drawerPusher = pushDrawer;
    personaSetter = setAiPersona;
    notificationsSetter = setNotifications;
    currencySetter = setCurrency;
    memoryClearer = () => setAiMemoryTags([]);
    checkInPerformer = setHasCheckedInToday;
    t = typeof tFromContext === 'function' ? tFromContext : t;
  } catch (e) {
    console.warn('AppContext not found, system actions disabled');
  }
  
  // 1. Check for AI System Actions
  const systemActions = message.attachments?.filter((a: any) => a.type === '0B_SYSTEM_ACTION') || [];
  const actionsExecuted = useRef<Set<string>>(new Set());
  const allowedLanguages = new Set(['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'ar']);

  useEffect(() => {
    if (!isMyMessage()) {
      systemActions.forEach((systemAction: any, index: number) => {
        const actionKey = `${systemAction.action}-${systemAction.payload?.value || index}`;
        if (!actionsExecuted.current.has(actionKey)) {
          actionsExecuted.current.add(actionKey);
          
          const payloadValue = systemAction.payload?.value;
          if (systemAction.action === 'SET_THEME') {
            themeSetter(payloadValue);
          } else if (systemAction.action === 'SET_LANGUAGE') {
            if (typeof payloadValue === 'string' && allowedLanguages.has(payloadValue)) {
              langSetter(payloadValue);
            }
          } else if (systemAction.action === 'SET_CURRENCY') {
            currencySetter(payloadValue);
          } else if (systemAction.action === 'SET_NOTIFICATIONS') {
            notificationsSetter(payloadValue === 'true');
          } else if (systemAction.action === 'NAVIGATE') {
            drawerPusher(payloadValue);
          } else if (systemAction.action === 'SET_PERSONA') {
            personaSetter(payloadValue);
          } else if (systemAction.action === 'CLEAR_MEMORY') {
            memoryClearer();
          } else if (systemAction.action === 'PERFORM_CHECKIN') {
            checkInPerformer(true);
          }
        }
      });
    }
  }, [systemActions, themeSetter, langSetter, notificationsSetter, currencySetter, drawerPusher, personaSetter, memoryClearer, checkInPerformer, isMyMessage]);

  // 2. Intercept BAP Protocol Attachments
  // We check if the message has a specific 0Buck Attachment signature
  const bapAttachment = message.attachments?.find((a: any) => a.type === '0B_CARD_V3');

  if (bapAttachment) {
    if (bapAttachment.component === '0B_PRODUCT_GRID') {
      return (
        <div className={`flex w-full my-2 ${isMyMessage() ? 'justify-end' : 'justify-start'}`}>
          <ProductGridCard data={bapAttachment.data} />
        </div>
      );
    }
    if (bapAttachment.component === '0B_CASHBACK_RADAR') {
      return (
        <div className={`flex w-full my-2 ${isMyMessage() ? 'justify-end' : 'justify-start'}`}>
          <CashbackRadarCard {...bapAttachment.data} />
        </div>
      );
    }
  }

  // 3. Fallback to Standard WhatsApp-style Text Bubbles
  const timeString = new Date(message.created_at || Date.now()).toLocaleTimeString([], {
    hour: '2-digit', 
    minute:'2-digit'
  });

  return (
    <div className={`flex w-full my-1 ${isMyMessage() ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[80%] px-3 py-2 rounded-xl text-[15px] relative break-words shadow-[0_1px_1px_rgba(0,0,0,0.1)] leading-relaxed ${
          isMyMessage() 
            ? 'bg-[var(--wa-bubble-out)] rounded-tr-none text-gray-800 dark:text-white border border-[#FFD9CD] dark:border-white/5' 
            : 'bg-[var(--wa-bubble-in)] rounded-tl-none text-gray-800 dark:text-white border border-gray-100 dark:border-white/5'
        }`}
      >
        <span className="whitespace-pre-wrap">{t(String(message.text ?? ''))}</span>
        
        {/* Timestamp */}
        <span className={`text-[10px] ml-3 float-right mt-3 font-medium select-none ${
          isMyMessage() ? 'text-orange-800/60 dark:text-white/40' : 'text-gray-400 dark:text-gray-500'
        }`}>
          {timeString}
        </span>
      </div>
    </div>
  );
};
