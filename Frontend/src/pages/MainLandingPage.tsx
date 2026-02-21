import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Wallet, ShoppingBag, Briefcase, Menu as MenuIcon, 
  MessageSquare, GraduationCap, ArrowRight, Sun, Moon,
  Globe, Phone, Mail, Instagram, Linkedin, Facebook,
  Twitter, MapPin, Clock, ShieldCheck, ChevronRight, Robot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const MainLandingPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const services = [
    {
      id: 'academy',
      title: 'EEUEZ ACADEMY',
      description: 'Plateforme d\'apprentissage en ligne pour maîtriser les technologies les plus demandées.',
      icon: GraduationCap,
      color: 'brand',
      link: '/academy',
      isInternal: true,
      iconBg: 'bg-brand-500/10',
      iconColor: 'text-brand-600'
    },
    {
      id: 'wallet',
      title: 'Z OR Wallet',
      description: 'Wallet et outils digitaux (KYC, encaissements, et intégrations) pour entreprises.',
      icon: Wallet,
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600',
      link: '#'
    },
    {
      id: 'market',
      title: 'EEUEZ-Market',
      description: 'Marketplace e-commerce pour PME et commerces locaux avec gestion intégrée.',
      icon: ShoppingBag,
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-600',
      link: 'https://eeuez-market.com/'
    },
    {
      id: 'job',
      title: 'EEUEZ-Job',
      description: 'Plateforme de recrutement et mise en relation entre employeurs et talents.',
      icon: Briefcase,
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600',
      link: 'https://eeuez-job.com/'
    },
    {
      id: 'menu',
      title: 'EEUEZ-Menu',
      description: 'Solution de menus digitaux avec QR code pour restaurateurs.',
      icon: MenuIcon,
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-600',
      link: 'https://eeuez-menu.com/'
    },
    {
      id: 'asyzys',
      title: 'Asyzys',
      description: 'Hub qui connecte les développeurs visionnaires à leurs utilisateurs.',
      icon: Globe,
      iconBg: 'bg-indigo-500/10',
      iconColor: 'text-indigo-600',
      link: 'https://asyzys.com/'
    }
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#041c16] text-[#e8f3ec]' : 'bg-[#f4fbf6] text-[#0f2f27]'} transition-colors duration-300 font-sans`}>
      {/* Dynamic styles to match essai.html exactly where Tailwind is hard */}
      <style dangerouslySetInnerHTML={{ __html: `
        [data-theme="dark"] {
          --bg: #041c16;
          --card: #08241c;
          --text: #e8f3ec;
          --muted: #9ab7aa;
          --accent: #389038;
          --glass: rgba(9,57,45,0.14);
        }
        :root {
          --brand-primary: #389038;
        }
      `}} />

      {/* Header */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 flex justify-center py-3 ${isScrolled ? 'bg-white/80 dark:bg-[#08241c]/80 backdrop-blur-md shadow-sm' : ''}`}>
        <nav className="w-full max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-white rounded-full p-1 flex items-center justify-center shadow-sm">
                <img src="/static/EEUEZ-logo.png" alt="EEUEZ Logo" className="w-8 h-8 object-contain" onError={(e) => {
                    // Fallback if the logo doesn't exist at that path in the dev env
                    e.currentTarget.src = "https://eeuez.com/static/EEUEZ-logo.png";
                }} />
            </div>
            <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              EEUEZ
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a href="#hero" className="text-sm font-bold opacity-80 hover:opacity-100 hover:text-emerald-600 transition-all">Accueil</a>
            <a href="#services" className="text-sm font-bold opacity-80 hover:opacity-100 hover:text-emerald-600 transition-all">Solutions</a>
            <a href="#pricing" className="text-sm font-bold opacity-80 hover:opacity-100 hover:text-emerald-600 transition-all">Forfaits</a>
            <a href="#contact" className="text-sm font-bold opacity-80 hover:opacity-100 hover:text-emerald-600 transition-all">Contact</a>
          </div>

          <div className="flex items-center gap-3">
             <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
               {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
             </Button>
             <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 font-bold shadow-lg shadow-emerald-500/20">
               Contact
             </Button>
          </div>
        </nav>
      </header>

      <main className="pt-24">
        {/* Hero Section */}
        <section id="hero" className="py-20 px-6 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 mb-6 px-4 py-1">
                EEUEZ PORTAL
              </Badge>
              <h1 className="text-4xl md:text-6xl font-black leading-[1.1] mb-6">
                Z OR Wallet & <br />
                <span className="text-emerald-600">solutions digitales</span> <br />
                pour le Cameroun
              </h1>
              <p className="text-lg opacity-80 mb-8 max-w-xl">
                Centralisez vos paiements, outils e-commerce/communication et services digitaux. 
                Support local et intégration rapide pour entreprises visionnaires.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-8 rounded-xl font-bold text-base transition-all hover:scale-105">
                  Découvrir nos solutions
                </Button>
                <Button variant="outline" className="border-emerald-200 text-emerald-700 h-12 px-8 rounded-xl font-bold text-base hover:bg-emerald-50">
                  Parler à un conseiller
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-800 p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                
                <div className="relative z-10 h-full flex flex-col justify-between text-white">
                  <div>
                    <Badge className="bg-white/20 text-white border-white/30 mb-4">API Paiement</Badge>
                    <h3 className="text-3xl font-black mb-2">Gérez vos transactions facilement</h3>
                    <p className="opacity-80">Wallet, onboarding KYC, et outils digitaux pour entreprises.</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
                    <div className="flex items-center justify-between mb-2">
                       <span className="flex items-center gap-2 font-bold">
                         <Wallet className="w-5 h-5" /> Créer un wallet
                       </span>
                       <span className="font-black text-xl">0 FCFA</span>
                    </div>
                    <div className="text-xs opacity-70 mb-4">Parité : 1 Z OR = 1 FCFA</div>
                    <Button className="w-full bg-white text-emerald-700 hover:bg-emerald-50 font-black rounded-xl">
                       Créer mon compte
                    </Button>
                  </div>
                </div>

                {/* Decorative circles */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl"></div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-black mb-4">Solutions EEUEZ</h2>
            <p className="opacity-70 mb-16 max-w-2xl mx-auto text-lg">
              Un écosystème complet pour digitaliser votre activité et booster votre croissance.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, idx) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -10 }}
                  onClick={() => service.isInternal ? navigate(service.link) : window.open(service.link, '_blank')}
                  className="bg-white dark:bg-[#08241c] p-8 rounded-3xl shadow-lg border border-emerald-100 dark:border-emerald-900/30 text-left cursor-pointer group hover:shadow-2xl transition-all"
                >
                  <div className={`w-16 h-16 ${service.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <service.icon className={`w-8 h-8 ${service.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    {service.title}
                    {service.isInternal && <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-[10px] px-2">Nouveau</Badge>}
                  </h3>
                  <p className="opacity-70 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                    {service.id === 'academy' ? 'Accéder à l\'Academy' : 'Découvrir'}
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing/Forfaits */}
        <section id="pricing" className="py-24 max-w-7xl mx-auto px-6">
           <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-black mb-4">Nos Forfaits</h2>
             <p className="opacity-70 text-lg">Des solutions adaptées à chaque étape de votre croissance.</p>
           </div>

           <div className="grid md:grid-cols-3 gap-8">
             {[
               { name: 'Starter', price: '15 000', desc: 'Pour lancer sa présence en ligne.', features: ['1 visuel par semaine', '1 réseau social pilote', 'Onboarding wallet'] },
               { name: 'Boost', price: '35 000', desc: 'Le plus choisi pour la communication.', features: ['4 visuels/semaine', '2 réseaux sociaux', 'Reporting mensuel'], popular: true },
               { name: 'Scale', price: '60 000', desc: 'Pour scaler avec dev custom.', features: ['6 visuels/semaine', 'Campagnes sponsorisées', 'Landing page incluse'] }
             ].map((plan, idx) => (
               <div key={idx} className={`bg-white dark:bg-[#08241c] p-10 rounded-3xl shadow-xl border ${plan.popular ? 'border-emerald-500 scale-105' : 'border-emerald-100 dark:border-emerald-900/30'} relative flex flex-col`}>
                 {plan.popular && <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 px-4 py-1">POPULAIRE</Badge>}
                 <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                 <div className="text-4xl font-black mb-4">{plan.price} <span className="text-sm font-normal opacity-60">FCFA/mois</span></div>
                 <p className="opacity-70 mb-8">{plan.desc}</p>
                 <ul className="space-y-4 mb-10 flex-1">
                   {plan.features.map((f, i) => (
                     <li key={i} className="flex items-center gap-3 text-sm">
                       <ShieldCheck className="w-5 h-5 text-emerald-600" /> {f}
                     </li>
                   ))}
                 </ul>
                 <Button className={`w-full h-12 rounded-xl font-bold ${plan.popular ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}>
                   Choisir ce forfait
                 </Button>
               </div>
             ))}
           </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 bg-emerald-600 text-white">
           <div className="max-w-7xl mx-auto px-6">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                 <div>
                    <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Prêt à digitaliser votre succès ?</h2>
                    <p className="text-xl text-emerald-50 mb-12 opacity-90">
                       Rejoignez des centaines d'entreprises qui font confiance à EEUEZ pour leurs solutions technologiques.
                    </p>
                    <div className="space-y-6">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center"><Phone className="w-6 h-6" /></div>
                          <div>
                             <div className="text-sm opacity-70">Téléphone</div>
                             <div className="font-bold">+237 694 103 585</div>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center"><Mail className="w-6 h-6" /></div>
                          <div>
                             <div className="text-sm opacity-70">Email</div>
                             <div className="font-bold">contact@eeuez.com</div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="bg-white p-8 rounded-3xl text-[#0f2f27] shadow-2xl">
                    <h3 className="text-2xl font-black mb-6">Envoyez-nous un message</h3>
                    <form className="space-y-4">
                       <div className="grid md:grid-cols-2 gap-4">
                          <input type="text" placeholder="Nom complet" className="w-full bg-slate-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-emerald-500" />
                          <input type="email" placeholder="Email" className="w-full bg-slate-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-emerald-500" />
                       </div>
                       <textarea placeholder="Votre message..." rows={4} className="w-full bg-slate-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-emerald-500"></textarea>
                       <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-14 rounded-xl font-bold text-lg">
                          Envoyer le message
                       </Button>
                    </form>
                 </div>
              </div>
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-emerald-100 dark:border-emerald-900/30">
         <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
               <div className="md:col-span-1">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                        <img src="/static/EEUEZ-logo.png" alt="EEUEZ" className="w-6 h-6" onError={(e) => e.currentTarget.src="https://eeuez.com/static/EEUEZ-logo.png"} />
                    </div>
                    <span className="text-2xl font-black">EEUEZ</span>
                  </div>
                  <p className="opacity-60 text-sm leading-relaxed">
                     Solutions digitales innovantes, wallet sécurisé et éducation technologique pour l'Afrique de demain.
                  </p>
               </div>
               
               <div>
                  <h4 className="font-bold mb-6">Navigation</h4>
                  <ul className="space-y-3 text-sm opacity-70">
                     <li><a href="#" className="hover:text-emerald-600">Accueil</a></li>
                     <li><a href="#" className="hover:text-emerald-600">Solutions</a></li>
                     <li><a href="#" className="hover:text-emerald-600">Forfaits</a></li>
                     <li><a href="#" className="hover:text-emerald-600">Contact</a></li>
                  </ul>
               </div>

               <div>
                  <h4 className="font-bold mb-6">Légal</h4>
                  <ul className="space-y-3 text-sm opacity-70">
                     <li><a href="#" className="hover:text-emerald-600">Mentions légales</a></li>
                     <li><a href="#" className="hover:text-emerald-600">Confidentialité</a></li>
                     <li><a href="#" className="hover:text-emerald-600">Conditions d'utilisation</a></li>
                  </ul>
               </div>

               <div>
                  <h4 className="font-bold mb-6">Suivez-nous</h4>
                  <div className="flex gap-4">
                     <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600 cursor-pointer hover:bg-emerald-600 hover:text-white transition-all"><Facebook className="w-5 h-5" /></div>
                     <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600 cursor-pointer hover:bg-emerald-600 hover:text-white transition-all"><Twitter className="w-5 h-5" /></div>
                     <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600 cursor-pointer hover:bg-emerald-600 hover:text-white transition-all"><Linkedin className="w-5 h-5" /></div>
                  </div>
               </div>
            </div>
            
            <div className="pt-8 border-t border-emerald-100 dark:border-emerald-900/30 text-center text-sm opacity-50">
               © {new Date().getFullYear()} EEUEZ Group. Tous droits réservés.
            </div>
         </div>
      </footer>
    </div>
  );
};
