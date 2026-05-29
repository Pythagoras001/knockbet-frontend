/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  LayoutDashboard,
  Users,
  Calendar,
  Trophy,
  CreditCard,
  Search,
  Filter,
  Plus,
  Edit2,
  Ban,
  Bell,
  Settings,
  Globe,
  Activity,
  Zap,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Info,
  Camera,
  ArrowLeft,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, type ReactNode } from 'react';
import EventsView from './components/Eventos/EventsView.tsx';
import EventControl from './components/Eventos/EventControl.tsx';
import BetsView from './components/Apuestas/BetsView.tsx';
import PlaceBetView from './components/Apuestas/PlaceBetView.tsx';
import FightScheduler from './components/Eventos/FightScheduler.tsx';
import FinanceView from './components/Finanzas/FinanceView.tsx';
import FinanceDetailView from './components/Finanzas/FinanceDetailView.tsx';
import AccountStatementView from './components/Finanzas/AccountStatementView.tsx';
import DashboardView from './components/DashBoard/DashboardView.tsx';
import FighterDirectory from './components/Peleadores/FighterDirectory.tsx';
import RegisterFighter from './components/Peleadores/RegisterFighter.tsx';
import LiveBookView from './components/Eventos/LiveBookView.tsx';
import logo from './assets/Logo.png';
import { Evento } from "@/src/types/GET/Evento.ts";
import { Apuesta } from "@/src/types/GET/Apuesta.ts";
import { Resultado } from "@/src/types/GET/Resultado.ts";


export default function App() {
  const [activeTab, setActiveTab] = useState('All');
  const [currentView, setCurrentView] = useState<'dashboard' | 'directory' | 'register' | 'events' | 'event-control' | 'bets' | 'place-bet' | 'scheduler' | 'finance' | 'finance-detail' | 'account-statement' | 'live-book'>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Evento | null>(null);
  const [selectedApuesta, setSelectedApuesta] = useState<Apuesta | null>(null);
  const [selectedResultado, setSelectedResultado] = useState<Resultado | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    weightClass: 'Middleweight',
    record: '',
    email: '',
    phone: ''
  });

  const handleInputChange = (e: { target: { name: string, value: string } }) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex min-h-screen bg-surface font-body text-white selection:bg-primary selection:text-black relative">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Responsive */}
      <aside className={`fixed inset-y-0 left-0 z-[60] flex flex-col border-r border-white/5 bg-surface-low px-4 py-8 shadow-[10px_0_30px_rgba(0,0,0,0.5)] transition-all duration-500 ease-in-out lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64`}>
        <div className="mb-10 flex items-center justify-between px-2 overflow-hidden whitespace-nowrap">
          <div className="flex items-center gap-3">
            {/*<div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded bg-primary text-black">*/}


            <img src={logo} alt="logo" style={{ width: 80 }} />

            {/*</div>*/}
            {(!isSidebarCollapsed || isMobileMenuOpen) && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="transition-all"
              >
                <h1 className="font-headline text-lg font-extrabold uppercase leading-none text-white"><span className="editorial-outline-primary block md:inline">KNOCK</span>BET</h1>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-zinc-500">Panel de Control</p>
              </motion.div>
            )}
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-2 text-zinc-500 hover:text-white"
          >
            <X size={20} />
          </button>

        </div>

        <nav className="flex-1 space-y-1">
          <SidebarLink
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={currentView === 'dashboard'}
            onClick={() => { setCurrentView('dashboard'); setIsMobileMenuOpen(false); }}
            collapsed={isSidebarCollapsed}
            mobile={isMobileMenuOpen}
          />
          <SidebarLink
            icon={<Users size={20} />}
            label="Fighters"
            active={currentView === 'directory' || currentView === 'register'}
            onClick={() => { setCurrentView('directory'); setIsMobileMenuOpen(false); }}
            collapsed={isSidebarCollapsed}
            mobile={isMobileMenuOpen}
          />
          <SidebarLink
            icon={<Calendar size={20} />}
            label="Events"
            active={currentView === 'events' || currentView === 'scheduler'}
            onClick={() => { setCurrentView('events'); setIsMobileMenuOpen(false); }}
            collapsed={isSidebarCollapsed}
            mobile={isMobileMenuOpen}
          />
          <SidebarLink
            icon={<CreditCard size={20} />}
            label="Finance"
            active={currentView === 'finance'}
            onClick={() => { setCurrentView('finance'); setIsMobileMenuOpen(false); }}
            collapsed={isSidebarCollapsed}
            mobile={isMobileMenuOpen}
          />
        </nav>

        <div className="mt-auto border-t border-white/5 pt-6 space-y-4">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:flex w-full items-center justify-center rounded border border-white/5 bg-surface-high py-2 text-zinc-500 hover:text-white transition-all mt-4"
          >
            {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 min-w-0 bg-surface transition-all duration-500 ease-in-out ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'} pb-24 lg:pb-0`}>
        {/* Top Header */}
        <header className={`sticky top-0 z-50 border-b border-white/5 bg-surface/80 backdrop-blur-xl transition-all duration-500 ease-in-out overflow-x-hidden`}>
          <div className="mx-auto flex w-full max-w-[1920px] items-center justify-between px-4 md:px-8 py-4">
            <div className="flex items-center gap-4 md:gap-8">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors"
              >
                <Menu size={24} />
              </button>
              <span className="text-xl md:text-2xl font-black italic tracking-tighter text-primary uppercase">KNOCKBET</span>
              <nav className="hidden xl:flex gap-6">
                {[
                  { label: 'Dashboard', view: 'dashboard' },
                  { label: 'Fighters', view: 'directory' },
                  { label: 'Events', view: 'events' },
                  { label: 'Bets', view: 'bets' },
                  { label: 'Finance', view: 'finance' }
                ].map((item) => {
                  let isActive = currentView === item.view;
                  if (item.label === 'Fighters' && currentView === 'register') isActive = true;
                  if (item.label === 'Events' && currentView === 'scheduler') isActive = true;
                  if (item.label === 'Bets' && currentView === 'place-bet') isActive = true;

                  return (
                    <button
                      key={item.label}
                      onClick={() => setCurrentView(item.view as any)}
                      className={`font-headline text-xs font-bold uppercase tracking-tight transition-colors ${isActive ? 'border-b-2 border-primary pb-1 text-white' : 'text-zinc-500 hover:text-zinc-200'
                        }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <IconButton icon={<Bell size={20} />} />
              </div>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <div className="px-4 md:px-0">
            {currentView === 'dashboard' ? (
              <DashboardView
                key="dashboard"
                onNavigate={(view) => setCurrentView(view)}
                onEventClick={(event) => {
                  setSelectedEvent(event);
                  setSelectedApuesta(null);
                  setCurrentView('event-control');
                }}
              />
            ) : currentView === 'directory' ? (
              <FighterDirectory
                key="directory"
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onRegisterClick={() => setCurrentView('register')}
              />
            ) : currentView === 'events' ? (
              <EventsView
                onEventClick={(event) => {
                  setSelectedEvent(event);
                  setSelectedApuesta(null);
                  setCurrentView('event-control');
                }}
                onRegisterEvent={() => setCurrentView('scheduler')}
              />
            ) : currentView === 'event-control' ? (
              <EventControl
                onBack={() => setCurrentView('events')}
                event={selectedEvent || undefined}
                onViewDetail={(resultado) => {
                  setSelectedResultado(resultado);
                  setCurrentView('finance-detail');
                }}
                onViewLiveBook={(apuesta) => {
                  setSelectedApuesta(apuesta);
                  setCurrentView('live-book');
                }}
              />
            ) : currentView === 'live-book' ? (
              <LiveBookView
                key="live-book"
                onBack={() => setCurrentView('event-control')}
                event={selectedEvent || undefined}
                apuestaActual={selectedApuesta || undefined}
              />
            ) : currentView === 'scheduler' ? (
              <FightScheduler key="scheduler" onBack={() => setCurrentView('events')} onNewFighter={() => setCurrentView('register')} onDirectory={() => setCurrentView('directory')} />
            ) : currentView === 'bets' ? (
              <BetsView
                key="bets"
                onBetClick={(apuesta) => {
                  setSelectedApuesta(apuesta);
                  setSelectedEvent(apuesta.pelea);

                  if (apuesta.activo === 'FINALIZADA') {
                    setSelectedResultado({
                      id: apuesta.id,
                      pelea: apuesta.pelea,
                      ganador: null as any,
                      perdedor: null as any,
                      horaFinalizacion: apuesta.pelea.horaIncio
                    });
                    setCurrentView('finance-detail');
                    return;
                  }

                  if (apuesta.activo === 'CERRADA') {
                    setCurrentView('live-book');
                    return;
                  }

                  setCurrentView('place-bet');
                }}
              />
            ) : currentView === 'place-bet' ? (
              <PlaceBetView
                key="place-bet"
                onBack={() => setCurrentView('bets')}
                onViewLiveBook={(apuesta) => {
                  setSelectedApuesta(apuesta);
                  setSelectedEvent(apuesta.pelea);
                  setCurrentView('live-book');
                }}
                apuesta={selectedApuesta || undefined}
              />
            ) : currentView === 'finance' ? (
              <FinanceView
                key="finance"
                onViewDetail={(resultado) => {
                  setSelectedResultado(resultado);
                  setCurrentView('finance-detail');
                }}
                onViewAccountStatement={() => setCurrentView('account-statement')}
              />
            ) : currentView === 'finance-detail' ? (
              <FinanceDetailView
                key="finance-detail"
                onBack={() => setCurrentView('finance')}
                resultado={selectedResultado}
              />
            ) : currentView === 'account-statement' ? (
              <AccountStatementView
                key="account-statement"
                onBack={() => setCurrentView('finance')}
              />
            ) : currentView === 'register' ? (
              <RegisterFighter
                key="register"
                onBack={() => setCurrentView('directory')}
              />
            ) : null}
          </div>
        </AnimatePresence>

        {/* Footer */}
        <footer className="border-t border-white/5 bg-surface-low/50 py-12 px-8 mt-20">
          <div className="mx-auto flex max-w-[1920px] flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex flex-col gap-2">
              <div className="text-lg font-black text-white uppercase tracking-tighter italic">KNOCKBET</div>
              <p className="text-xs text-zinc-500">© 2026 KnockBet Editorial. All rights reserved.</p>
            </div>
            <div className="flex gap-8">
              {['Privacy Policy', 'Terms of Service', 'Contact Us'].map(link => (
                <a key={link} href="#" className="text-xs text-zinc-500 hover:text-white transition-colors">{link}</a>
              ))}
            </div>
            <div className="flex gap-4">
              <IconButton icon={<Zap size={18} />} />
              <IconButton icon={<Users size={18} />} />
            </div>
          </div>
        </footer>

        {/* Bottom Navigation - Mobile only */}
        <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-surface-high border border-white/10 rounded-2xl p-2 z-[70] shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md">
          <div className="flex items-center justify-around">
            <BottomNavLink
              icon={<LayoutDashboard size={20} />}
              label="HOME"
              active={currentView === 'dashboard'}
              onClick={() => setCurrentView('dashboard')}
            />
            <BottomNavLink
              icon={<Users size={20} />}
              label="FIGHT"
              active={currentView === 'directory' || currentView === 'register'}
              onClick={() => setCurrentView('directory')}
            />
            <BottomNavLink
              icon={<Zap size={20} />}
              label="BETS"
              active={currentView === 'bets' || currentView === 'place-bet'}
              onClick={() => setCurrentView('bets')}
            />
            <BottomNavLink
              icon={<Calendar size={20} />}
              label="EVENTS"
              active={currentView === 'events' || currentView === 'scheduler'}
              onClick={() => setCurrentView('events')}
            />
            <BottomNavLink
              icon={<CreditCard size={20} />}
              label="FINANCE"
              active={currentView === 'finance'}
              onClick={() => setCurrentView('finance')}
            />
          </div>
        </nav>
      </main>
    </div>
  );
}

function BottomNavLink({ icon, label, active, onClick }: { icon: ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1.5 py-2 px-4 rounded-xl transition-all ${active ? 'text-primary' : 'text-zinc-500'
        }`}
    >
      <div className={`transition-all duration-300 ${active ? 'scale-110' : ''}`}>
        {icon}
      </div>
      <span className={`text-[8px] font-black tracking-[0.15em] uppercase ${active ? 'opacity-100' : 'opacity-60'}`}>
        {label}
      </span>
      {active && (
        <motion.div
          layoutId="bottom-nav-indicator"
          className="w-1 h-1 rounded-full bg-primary absolute bottom-1"
        />
      )}
    </button>
  );
}


function SidebarLink({ icon, label, active = false, onClick, collapsed = false, mobile = false }: { icon: ReactNode, label: string, active?: boolean, onClick?: () => void, collapsed?: boolean, mobile?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded px-4 py-3 text-sm font-medium transition-all group relative ${active
        ? 'bg-gradient-to-r from-primary/20 to-transparent border-l-4 border-primary text-primary'
        : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-100'
        } ${(collapsed && !mobile) ? 'justify-center px-0' : ''}`}
    >
      <span className="flex-shrink-0 transition-transform group-hover:scale-110">
        {icon}
      </span>
      {(!collapsed || mobile) && (
        <span className="overflow-hidden whitespace-nowrap transition-all duration-300">
          {label}
        </span>
      )}
      {(collapsed && !mobile) && (
        <div className="absolute left-full ml-4 hidden group-hover:block z-50">
          <div className="bg-surface-highest text-white text-[10px] font-black uppercase tracking-widest py-2 px-4 rounded shadow-2xl border border-white/5 whitespace-nowrap">
            {label}
          </div>
        </div>
      )}
    </button>
  );
}

function IconButton({ icon }: { icon: ReactNode }) {
  return (
    <button className="rounded-lg p-2 text-zinc-400 transition-all hover:bg-surface-high hover:text-white">
      {icon}
    </button>
  );
}

function PaginationButton({ icon, label, primary = false }: { icon: ReactNode, label: string, primary?: boolean }) {
  return (
    <button className={`flex items-center gap-1 rounded border border-white/5 px-4 py-2 text-[10px] font-bold transition-all ${primary
      ? 'bg-primary text-black hover:bg-primary-dim'
      : 'bg-surface-highest text-zinc-400 hover:text-white'
      }`}>
      {primary ? null : icon}
      {label.toUpperCase()}
      {primary ? icon : null}
    </button>
  );
}

function StatCard({
  label,
  value,
  icon,
  subText,
  subContent,
  highlightColor = "text-primary"
}: {
  label: string,
  value: string,
  icon: ReactNode,
  subText?: string,
  subContent?: ReactNode,
  highlightColor?: string
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="relative overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br from-surface-high to-surface-low p-6 shadow-xl"
    >
      <div className="absolute -right-4 -top-4 opacity-[0.03] scale-150 text-white">
        {icon}
      </div>
      <p className={`text-[10px] font-bold uppercase tracking-widest ${highlightColor} mb-1`}>{label}</p>
      <h3 className="font-headline text-3xl font-black text-white">{value}</h3>
      {subText && <p className="mt-2 text-xs text-zinc-500">{subText}</p>}
      {subContent}
    </motion.div>
  );
}
