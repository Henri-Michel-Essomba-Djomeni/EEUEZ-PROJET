import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  BookOpen, Award, Users, ArrowRight, CheckCircle2, Star, 
  Globe, Zap, ShieldCheck, Play, Sparkles, MousePointer2, 
  BarChart3, TrendingUp, Lock, Clock, Rocket, Code, Database,
  Layers, ChevronRight, Target, GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.2
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.7, 
        ease: [0.22, 1, 0.36, 1] 
      } 
    }
  };

  const floatAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const stats = [
    { number: "5000+", label: "Étudiants actifs", icon: Users },
    { number: "98%", label: "Taux de satisfaction", icon: Star },
    { number: "250+", label: "Heures de contenu", icon: Clock },
    { number: "50+", label: "Cours certifiants", icon: Award }
  ];

  const features = [
    {
      icon: Zap,
      title: "Apprentissage Accéléré",
      description: "Méthodologie éprouvée pour maîtriser rapidement les compétences techniques les plus demandées.",
      bg: "from-orange-500/10 to-orange-600/5",
      iconBg: "bg-gradient-to-br from-orange-500 to-orange-600",
      color: "text-orange-600"
    },
    {
      icon: ShieldCheck,
      title: "Certifications Reconnues",
      description: "Obtenez des certifications vérifiables appréciées par les recruteurs du monde entier.",
      bg: "from-blue-500/10 to-blue-600/5",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
      color: "text-blue-600"
    },
    {
      icon: Target,
      title: "Projets Concrets",
      description: "Travaillez sur des cas réels et construisez un portfolio impressionnant dès aujourd'hui.",
      bg: "from-purple-500/10 to-purple-600/5",
      iconBg: "bg-gradient-to-br from-purple-500 to-purple-600",
      color: "text-purple-600"
    },
    {
      icon: Users,
      title: "Communauté Active",
      description: "Échangez avec des milliers d'apprenants et bénéficiez du soutien d'experts passionnés.",
      bg: "from-emerald-500/10 to-emerald-600/5",
      iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      color: "text-emerald-600"
    },
    {
      icon: TrendingUp,
      title: "Suivi de Progression",
      description: "Visualisez vos progrès en temps réel avec des analytics détaillés et motivants.",
      bg: "from-pink-500/10 to-pink-600/5",
      iconBg: "bg-gradient-to-br from-pink-500 to-pink-600",
      color: "text-pink-600"
    },
    {
      icon: Globe,
      title: "Accès Illimité",
      description: "Apprenez à votre rythme, 24/7, depuis n'importe où dans le monde.",
      bg: "from-indigo-500/10 to-indigo-600/5",
      iconBg: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      color: "text-indigo-600"
    }
  ];

  const technologies = [
    "Z OR Wallet", "EEUEZ-Market", "EEUEZ-Job", "Asyzys", "EEUEZ-Menu", 
    "Zevaba"
  ];

  const testimonials = [
    {
      name: "Sarah Kouam",
      role: "Développeuse Full-Stack",
      company: "TechCorp",
      text: "EEUEZ Academy m'a permis de passer de débutante à développeuse professionnelle en 6 mois. Les projets concrets font toute la différence.",
      avatar: "SK",
      rating: 5
    },
    {
      name: "Marc Ndjomo",
      role: "Data Scientist",
      company: "DataVision",
      text: "La qualité pédagogique est exceptionnelle. J'ai multiplié mon salaire par 3 grâce aux compétences acquises ici.",
      avatar: "MN",
      rating: 5
    },
    {
      name: "Aminata Diallo",
      role: "DevOps Engineer",
      company: "CloudTech",
      text: "Les certifications EEUEZ sont reconnues internationalement. J'ai décroché mon emploi de rêve en moins de 2 mois après ma formation.",
      avatar: "AD",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-hidden">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-brand-600 to-brand-700 rounded-xl flex items-center justify-center shadow-lg shadow-brand-600/30 group-hover:shadow-xl group-hover:shadow-brand-600/40 transition-all">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent">
              EEUEZ ACADEMY
            </span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors">
              Fonctionnalités
            </a>
            <a href="#testimonials" className="text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors">
              Témoignages
            </a>
            <a href="#pricing" className="text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors">
              Tarifs
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate('/login')}
              variant="ghost"
              className="font-semibold text-sm hidden sm:flex hover:bg-brand-50 hover:text-brand-700"
            >
              Connexion
            </Button>
            <Button
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white rounded-xl px-6 h-11 text-sm font-bold shadow-lg shadow-brand-600/30 hover:shadow-xl hover:shadow-brand-600/40 transition-all hover:scale-105"
            >
              Commencer
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-brand-400/20 to-purple-400/20 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ 
              rotate: -360,
              scale: [1, 1.3, 1]
            }}
            transition={{ 
              duration: 25, 
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-brand-400/20 rounded-full blur-3xl"
          />
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto relative z-10"
        >
          {/* Badge */}
          <motion.div 
            variants={itemVariants}
            className="flex justify-center mb-8"
          >
            <Badge className="bg-gradient-to-r from-brand-600/10 to-purple-600/10 text-brand-700 border border-brand-600/20 px-6 py-2 text-sm font-semibold rounded-full backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Plateforme n°1 en Afrique francophone
            </Badge>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-center mb-6 leading-[1.1]"
          >
            <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
              Transformez votre
            </span>
            <br />
            <span className="bg-gradient-to-r from-brand-600 via-purple-600 to-brand-600 bg-clip-text text-transparent">
              carrière tech
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-slate-600 text-center max-w-3xl mx-auto mb-12 leading-relaxed font-medium"
          >
            Maîtrisez les outils les plus demandées avec des formations pratiques, 
            des certifications reconnues et une communauté de <span className="text-brand-600 font-bold">5000+ étudiants</span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button
              onClick={() => navigate('/register')}
              className="h-14 px-10 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white rounded-2xl font-bold text-base shadow-2xl shadow-brand-600/40 transition-all hover:scale-105 hover:shadow-brand-600/50 group"
            >
              Commencer gratuitement
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
              variant="outline"
              className="h-14 px-10 border-2 border-slate-200 text-slate-900 rounded-2xl font-bold text-base hover:bg-slate-50 hover:border-brand-300 transition-all group"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Voir la démo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5, scale: 1.05 }}
                className="text-center group cursor-pointer"
              >
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-500/10 to-brand-600/5 rounded-2xl flex items-center justify-center group-hover:shadow-lg transition-all">
                    <stat.icon className="w-6 h-6 text-brand-600" />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-black text-slate-900 mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-slate-600 font-semibold">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Hero Visual */}
        <motion.div 
          id="demo"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto mt-20 relative"
        >
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-700/50"
          >
            {/* Mock Dashboard */}
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-white font-semibold">Plateforme Sécurisée</span>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center">
                    <Code className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xl mb-1">Tableau de bord étudiant</h3>
                    <p className="text-slate-400 text-sm">Suivez votre progression en temps réel</p>
                  </div>
                </div>

                {/* Progress Bars */}
                <div className="space-y-4">
                  {[
                    { name: "React Avancé", progress: 85, color: "bg-blue-500" },
                    { name: "Node.js Backend", progress: 92, color: "bg-green-500" },
                    { name: "MongoDB Database", progress: 78, color: "bg-emerald-500" }
                  ].map((course, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-2">
                        <span className="text-white font-semibold text-sm">{course.name}</span>
                        <span className="text-brand-400 font-bold text-sm">{course.progress}%</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${course.progress}%` }}
                          transition={{ duration: 1, delay: idx * 0.2 }}
                          className={`h-full ${course.color} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <motion.div 
              animate={floatAnimation}
              className="absolute top-20 -right-8 bg-white rounded-2xl shadow-2xl p-6 w-64 border border-slate-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">+1,247</div>
                  <div className="text-xs text-slate-600 font-semibold">Nouveaux diplômés</div>
                </div>
              </div>
              <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +23% ce mois
              </div>
            </motion.div>

            <motion.div 
              animate={{ ...floatAnimation, transition: { ...floatAnimation.transition, delay: 1 } }}
              className="absolute bottom-20 -left-8 bg-white rounded-2xl shadow-2xl p-6 w-64 border border-slate-200"
            >
              <div className="flex items-center gap-2 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="text-sm text-slate-900 font-semibold mb-2">
                "Formation exceptionnelle ! J'ai doublé mon salaire."
              </div>
              <div className="text-xs text-slate-600">
                - Marie K., Développeuse
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Technologies */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm text-slate-500 font-semibold mb-8 uppercase tracking-wider">
            outils enseignées
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {technologies.map((tech, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.1 }}
                className="text-slate-400 font-black text-lg hover:text-brand-600 transition-colors cursor-pointer"
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="bg-brand-600/10 text-brand-700 border border-brand-600/20 px-4 py-2 text-xs font-bold mb-6">
              POURQUOI NOUS CHOISIR
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">
              Une plateforme conçue
              <br />
              <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
                pour votre réussite
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Tout ce dont vous avez besoin pour maîtriser les compétences techniques 
              et décrocher le job de vos rêves.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onHoverStart={() => setHoveredFeature(idx)}
                onHoverEnd={() => setHoveredFeature(null)}
                className={`relative p-8 rounded-3xl bg-gradient-to-br ${feature.bg} border border-slate-200/50 backdrop-blur-sm transition-all cursor-pointer group`}
              >
                <div className={`w-14 h-14 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: hoveredFeature === idx ? 1 : 0, x: hoveredFeature === idx ? 0 : -10 }}
                  className="flex items-center gap-2 mt-4 text-brand-600 font-bold text-sm"
                >
                  En savoir plus
                  <ChevronRight className="w-4 h-4" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="bg-purple-600/10 text-purple-700 border border-purple-600/20 px-4 py-2 text-xs font-bold mb-6">
              TÉMOIGNAGES
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">
              Ils ont transformé
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-brand-600 bg-clip-text text-transparent">
                leur carrière
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200/50 hover:shadow-2xl transition-all"
              >
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-600 to-brand-700 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-600">{testimonial.role} • {testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="py-24 px-6 bg-gradient-to-br from-brand-600 to-brand-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-20" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.div
            animate={floatAnimation}
            className="inline-block mb-6"
          >
            <Rocket className="w-16 h-16 text-white/90" />
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            Prêt à démarrer votre transformation ?
          </h2>
          <p className="text-xl text-white/90 mb-12 leading-relaxed max-w-2xl mx-auto">
            Rejoignez plus de 5000 étudiants qui ont déjà fait le premier pas 
            vers une carrière tech épanouissante et lucrative.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => navigate('/register')}
              className="h-16 px-12 bg-white hover:bg-slate-50 text-brand-600 rounded-2xl font-bold text-lg shadow-2xl hover:scale-105 transition-all group"
            >
              Commencer gratuitement
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              className="h-16 px-12 border-2 border-white/30 text-white hover:bg-white/10 rounded-2xl font-bold text-lg backdrop-blur-sm"
            >
              Parler à un conseiller
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Aucune carte requise</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Accès immédiat</span>
            </div>
            <div className="flex items-center gap-2 hidden sm:flex">
              <CheckCircle2 className="w-5 h-5" />
              <span>Garantie 14 jours</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-600 to-brand-700 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-black">EEUEZ ACADEMY</span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-6 max-w-md">
                La plateforme de référence pour apprendre les technologies les plus demandées 
                et transformer votre carrière dans la tech.
              </p>
              <div className="flex gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.1, y: -3 }}
                    className="w-10 h-10 bg-slate-800 hover:bg-brand-600 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <div className="w-5 h-5 bg-slate-600 rounded" />
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Explorer</h4>
              <ul className="space-y-3 text-slate-400">
                <li className="hover:text-white transition-colors cursor-pointer">Tous les cours</li>
                <li className="hover:text-white transition-colors cursor-pointer">Certifications</li>
                <li className="hover:text-white transition-colors cursor-pointer">Parcours</li>
                <li className="hover:text-white transition-colors cursor-pointer">Tarifs</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Entreprise</h4>
              <ul className="space-y-3 text-slate-400">
                <li className="hover:text-white transition-colors cursor-pointer">À propos</li>
                <li className="hover:text-white transition-colors cursor-pointer">Blog</li>
                <li className="hover:text-white transition-colors cursor-pointer">Carrières</li>
                <li className="hover:text-white transition-colors cursor-pointer">Contact</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} EEUEZ ACADEMY • Tous droits réservés
            </p>
            <div className="flex gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-white transition-colors">Conditions</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};