import React, { useState } from 'react';
import { ViewType } from '../types';
import WelcomeMobile from './WelcomeMobile';
import LoginMobile from './LoginMobile';
import AIButlerMobile from './AIButlerMobile';
import LoungeHubMobile from './LoungeHubMobile';
import LoungeChatMobile from './LoungeChatMobile';
import SquareMobile from './SquareMobile';
import PrimeSupplierListMobile from './PrimeSupplierListMobile';
import PrimeMerchantDetailMobile from './PrimeMerchantDetailMobile';
import PrimeProductDetailMobile from './PrimeProductDetailMobile';
import ReferralRulesMobile from './ReferralRulesMobile';
import ReferralTalentMobile from './ReferralTalentMobile';
import ReferralUserMobile from './ReferralUserMobile';
import MeMobile from './MeMobile';
import FeedMobile from './FeedMobile';
import MobileAppBottomNav from './MobileAppBottomNav';

export default function MobileAppRouter() {
  const [currentView, setCurrentView] = useState<string>('welcome');

  // Define views that should NOT show the bottom navigation
  const hideNavViews = ['welcome', 'login', 'lounge_chat', 'prime_merchant', 'prime_product', 'referral_rules'];
  const showNav = !hideNavViews.includes(currentView);

  const renderView = () => {
    switch (currentView) {
      case 'welcome':
        return <WelcomeMobile setCurrentView={setCurrentView} />;
      case 'login':
        return <LoginMobile setCurrentView={setCurrentView} />;
      case 'chat': // Maps to AI Butler
      case 'butler':
        return <AIButlerMobile setCurrentView={setCurrentView} />;
      case 'lounge':
        return <LoungeHubMobile setCurrentView={setCurrentView} />;
      case 'lounge_chat':
        return <LoungeChatMobile setCurrentView={setCurrentView} />;
      case 'square':
        return <SquareMobile setCurrentView={setCurrentView} />;
      case 'prime':
      case 'prime_supplier':
        return <PrimeSupplierListMobile setCurrentView={setCurrentView} />;
      case 'prime_merchant':
        return <PrimeMerchantDetailMobile setCurrentView={setCurrentView} />;
      case 'prime_product':
        return <PrimeProductDetailMobile setCurrentView={setCurrentView} />;
      case 'referral':
      case 'referral_talent':
        return <ReferralTalentMobile setCurrentView={setCurrentView} />;
      case 'referral_user':
        return <ReferralUserMobile setCurrentView={setCurrentView} />;
      case 'referral_rules':
        return <ReferralRulesMobile setCurrentView={setCurrentView} />;
      case 'me':
        return <MeMobile setCurrentView={setCurrentView} />;
      case 'feed':
        return <FeedMobile setCurrentView={setCurrentView} />;
      default:
        return <WelcomeMobile setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="mobile-app-root h-dvh w-full overflow-hidden bg-[#0a0a0a] relative">
      <div className="h-full w-full overflow-y-auto overflow-x-hidden relative">
        {renderView()}
      </div>
      {showNav && <MobileAppBottomNav currentView={currentView} setCurrentView={setCurrentView} />}
    </div>
  );
}