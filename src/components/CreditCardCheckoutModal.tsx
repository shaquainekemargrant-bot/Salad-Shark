import React, { useState } from 'react';
import { CreditCard, Lock, CheckCircle2, ShieldCheck, X, Sparkles, Zap, ArrowRight } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface CreditCardCheckoutModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const CreditCardCheckoutModal: React.FC<CreditCardCheckoutModalProps> = ({
  onSuccess,
  onClose,
}) => {
  // Pre-fill valid arcade sandbox test values so user never gets stuck
  const [name, setName] = useState('SHARK HUNTER');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('777');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Format card number with spaces (XXXX-XXXX-XXXX-XXXX)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    let formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
  };

  // Format expiry (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setExpiry(raw);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvv(e.target.value.replace(/\D/g, '').slice(0, 3));
  };

  const executePayment = () => {
    setErrorMsg('');
    setIsProcessing(true);
    soundEngine.playPowerUp();

    // Fast, responsive authorization
    setTimeout(() => {
      setIsProcessing(false);
      soundEngine.playCodeRedeemSuccess();
      onSuccess();
    }, 700);
  };

  const handleInstantOneClick = () => {
    setName('SHARK HUNTER');
    setCardNumber('4242 4242 4242 4242');
    setExpiry('12/28');
    setCvv('777');
    executePayment();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executePayment();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-red-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-red-950/50 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            soundEngine.playButtonClick();
            onClose();
          }}
          disabled={isProcessing}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-full cursor-pointer transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-red-500/20 text-red-400 rounded-2xl border border-red-500/30 shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div className="min-w-0 pr-6">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-display text-lg sm:text-xl font-black text-white leading-tight">
                Card Checkout
              </h3>
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40">
                PREMIUM
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              Unlock <span className="text-red-400 font-bold">Carnivore Megalodon</span> (Inverted Diet)
            </p>
          </div>
        </div>

        {/* 1-CLICK INSTANT TEST AUTHORIZATION BUTTON (Prominent & Friction-Free) */}
        <div className="mb-4 p-3 bg-gradient-to-r from-red-950/60 to-rose-950/60 border border-red-500/40 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-red-300 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Instant Test Mode Active</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
              Pre-Approved
            </span>
          </div>

          <button
            type="button"
            onClick={handleInstantOneClick}
            disabled={isProcessing}
            className="w-full py-3 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 active:scale-[0.98] text-white font-display font-black text-sm rounded-xl cursor-pointer shadow-lg shadow-red-950/60 transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authorizing $2.99...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>⚡ 1-Click Instant Unlock ($2.99)</span>
              </>
            )}
          </button>
        </div>

        {/* Realistic Compact Card Preview */}
        <div className="relative w-full h-32 rounded-2xl bg-gradient-to-tr from-slate-950 via-red-950 to-neutral-900 border border-red-500/40 p-3.5 text-white shadow-md overflow-hidden mb-4">
          <div className="absolute top-0 right-0 w-28 h-28 bg-red-600/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-center mb-2">
            <span className="font-mono text-[10px] tracking-widest text-red-300 font-bold">SALAD SHARK VIP</span>
            <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>TEST PASSED</span>
            </div>
          </div>
          <div className="font-mono text-base tracking-wider font-bold mb-2 text-slate-100">
            {cardNumber || '•••• •••• •••• ••••'}
          </div>
          <div className="flex justify-between text-[10px] text-slate-300 font-mono">
            <div>
              <div className="text-[8px] uppercase tracking-wider text-slate-400">Cardholder</div>
              <div className="font-bold">{name.toUpperCase() || 'PLAYER ONE'}</div>
            </div>
            <div className="text-right">
              <div className="text-[8px] uppercase tracking-wider text-slate-400">Expires</div>
              <div className="font-bold">{expiry || 'MM/YY'}</div>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-3 p-2 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Detailed Form (Pre-populated) */}
        <form onSubmit={handleFormSubmit} className="space-y-2.5">
          <div>
            <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-0.5">
              Cardholder Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-red-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-0.5">
              Card Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                maxLength={19}
                className="w-full bg-slate-950 border border-slate-700 focus:border-red-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 font-mono tracking-wider"
              />
              <CreditCard className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-0.5">
                Expiry
              </label>
              <input
                type="text"
                value={expiry}
                onChange={handleExpiryChange}
                maxLength={5}
                className="w-full bg-slate-950 border border-slate-700 focus:border-red-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-0.5">
                CVV
              </label>
              <input
                type="password"
                value={cvv}
                onChange={handleCvvChange}
                maxLength={4}
                className="w-full bg-slate-950 border border-slate-700 focus:border-red-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 font-mono"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-display font-bold text-xs rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Submit Form Manually</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Security badge footer */}
        <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-slate-500 text-center">
          <Lock className="w-3 h-3 text-slate-400" />
          <span>256-Bit SSL Encrypted Arcade Simulation</span>
        </div>
      </div>
    </div>
  );
};
