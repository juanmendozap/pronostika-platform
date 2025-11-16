import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: 'en' | 'es';
  setLanguage: (lang: 'en' | 'es') => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.leaderboard': 'Leaderboard',
    'nav.history': 'History',
    'nav.profile': 'Profile',
    'nav.admin': 'Admin',
    'nav.logout': 'Logout',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcomeBack': 'Welcome back',
    'dashboard.availableBets': 'Available Bets',
    'dashboard.yourBets': 'Your Bets',
    'dashboard.noUserBets': 'You haven\'t placed any bets yet.',
    'dashboard.byTopic': 'By Topic',
    'dashboard.listView': 'List View',
    'dashboard.allCategories': 'All Categories',
    'dashboard.allStatus': 'All Status',
    'dashboard.sports': 'Sports',
    'dashboard.politics': 'Politics',
    'dashboard.social': 'Social',
    'dashboard.others': 'Others',
    'dashboard.openBets': 'Open Bets',
    'dashboard.closedBets': 'Closed Bets',
    'dashboard.allBets': 'All Bets',
    'dashboard.placeBet': 'Place Bet',
    'dashboard.closed': 'Closed',
    'dashboard.resolved': 'Resolved',
    'dashboard.noBets': 'No bets available',
    'dashboard.endDate': 'End Date',
    'dashboard.betCount': 'bet',
    'dashboard.betsCount': 'bets',
    
    // Login
    'login.title': 'Sign in to your account',
    'login.email': 'Email address',
    'login.password': 'Password',
    'login.signIn': 'Sign in',
    'login.noAccount': "Don't have an account?",
    'login.signUp': 'Sign up here',
    
    // Register
    'register.title': 'Create your account',
    'register.subtitle': 'Join Pronostika and start betting with 1000 free points!',
    'register.name': 'Full Name',
    'register.email': 'Email address',
    'register.password': 'Password (min 6 characters)',
    'register.confirmPassword': 'Confirm Password',
    'register.create': 'Create Account',
    'register.creating': 'Creating Account...',
    'register.hasAccount': 'Already have an account?',
    'register.signIn': 'Sign in here',
    
    // Leaderboard
    'leaderboard.title': 'Leaderboard',
    'leaderboard.rank': 'Rank',
    'leaderboard.player': 'Player',
    'leaderboard.points': 'Points',
    'leaderboard.bets': 'Total Bets',
    'leaderboard.wins': 'Wins',
    'leaderboard.successRate': 'Success Rate',
    'leaderboard.you': 'You',
    
    // History
    'history.title': 'Betting History',
    'history.all': 'All',
    'history.won': 'Won',
    'history.lost': 'Lost',
    'history.pending': 'Pending',
    'history.bet': 'Bet',
    'history.amount': 'Amount',
    'history.option': 'Option',
    'history.status': 'Status',
    'history.date': 'Date',
    'history.noBets': 'No betting history found',
    'history.stats.title': 'Your Statistics',
    'history.stats.total': 'Total Bets',
    'history.stats.won': 'Bets Won',
    'history.stats.lost': 'Bets Lost',
    'history.stats.pending': 'Pending Bets',
    'history.stats.winRate': 'Win Rate',
    'history.stats.totalWon': 'Total Points Won',
    'history.stats.totalLost': 'Total Points Lost',
    'history.stats.netGain': 'Net Gain/Loss',
    
    // Bet statuses
    'bet.open': 'Open',
    'bet.closed': 'Closed',
    'bet.resolved': 'Resolved',
    'bet.cancelled': 'Cancelled',
    
    // Betting interface
    'bet.availablePoints': 'Available Points',
    'bet.pool': 'Pool',
    'bet.totalPool': 'Total Pool',
    'bet.betAmount': 'Bet Amount (Points)',
    'bet.potentialWinnings': 'Potential Winnings',
    'bet.placeBet': 'Place Bet',
    'bet.placingBet': 'Placing Bet...',
    'bet.pointsStaked': 'points staked',
    'bet.potential': 'potential',
    'bet.noBeetsFound': 'No bets found matching your filters.',
    'bet.failedToPlace': 'Failed to place bet',
    
    // Categories
    'category.sports': 'Sports',
    'category.politics': 'Politics',
    'category.technology': 'Technology',
    'category.cryptocurrency': 'Cryptocurrency',
    'category.entertainment': 'Entertainment',
    'category.weather': 'Weather',
    'category.socialMedia': 'Social Media',
    'category.finance': 'Finance',
    
    // Admin Panel
    'admin.title': 'Admin Panel',
    'admin.subtitle': 'Manage betting categories, create new bets, and monitor platform activity.',
    'admin.createBet': 'Create New Bet',
    'admin.manageCategories': 'Manage Categories',
    'admin.createBettingMarket': 'Create New Betting Market',
    'admin.betTitle': 'Bet Title',
    'admin.category': 'Category',
    'admin.selectCategory': 'Select a category',
    'admin.description': 'Description',
    'admin.descriptionPlaceholder': 'Provide detailed description of the betting market...',
    'admin.bettingOptions': 'Betting Options',
    'admin.option': 'Option',
    'admin.odds': 'Odds',
    'admin.addOption': 'Add Option',
    'admin.removeOption': 'Remove Option',
    'admin.createBetButton': 'Create Bet',
    'admin.creating': 'Creating...',
    'admin.fillRequired': 'Please fill in all required fields',
    'admin.fillOptions': 'Please fill in all betting options with valid odds',
    'admin.betCreated': 'Bet created successfully!',
    'admin.failedToCreate': 'Failed to create bet',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.points': 'points',
  },
  es: {
    // Navigation
    'nav.dashboard': 'Panel Principal',
    'nav.leaderboard': 'Clasificación',
    'nav.history': 'Historial',
    'nav.profile': 'Perfil',
    'nav.admin': 'Admin',
    'nav.logout': 'Cerrar Sesión',
    
    // Dashboard
    'dashboard.title': 'Panel Principal',
    'dashboard.welcomeBack': 'Bienvenido de nuevo',
    'dashboard.availableBets': 'Apuestas Disponibles',
    'dashboard.yourBets': 'Tus Apuestas',
    'dashboard.noUserBets': 'Aún no has realizado ninguna apuesta.',
    'dashboard.byTopic': 'Por Tema',
    'dashboard.listView': 'Vista de Lista',  
    'dashboard.allCategories': 'Todas las Categorías',
    'dashboard.allStatus': 'Todos los Estados',
    'dashboard.sports': 'Deportes',
    'dashboard.politics': 'Política',
    'dashboard.social': 'Social',
    'dashboard.others': 'Otros',
    'dashboard.openBets': 'Apuestas Abiertas',
    'dashboard.closedBets': 'Apuestas Cerradas',
    'dashboard.allBets': 'Todas las Apuestas',
    'dashboard.placeBet': 'Apostar',
    'dashboard.closed': 'Cerrada',
    'dashboard.resolved': 'Resuelta',
    'dashboard.noBets': 'No hay apuestas disponibles',
    'dashboard.endDate': 'Fecha de Cierre',
    'dashboard.betCount': 'apuesta',
    'dashboard.betsCount': 'apuestas',
    
    // Login
    'login.title': 'Inicia sesión en tu cuenta',
    'login.email': 'Correo electrónico',
    'login.password': 'Contraseña',
    'login.signIn': 'Iniciar Sesión',
    'login.noAccount': '¿No tienes una cuenta?',
    'login.signUp': 'Regístrate aquí',
    
    // Register
    'register.title': 'Crea tu cuenta',
    'register.subtitle': '¡Únete a Pronostika y comienza a apostar con 1000 puntos gratis!',
    'register.name': 'Nombre Completo',
    'register.email': 'Correo electrónico',
    'register.password': 'Contraseña (mín 6 caracteres)',
    'register.confirmPassword': 'Confirmar Contraseña',
    'register.create': 'Crear Cuenta',
    'register.creating': 'Creando Cuenta...',
    'register.hasAccount': '¿Ya tienes una cuenta?',
    'register.signIn': 'Inicia sesión aquí',
    
    // Leaderboard
    'leaderboard.title': 'Clasificación',
    'leaderboard.rank': 'Posición',
    'leaderboard.player': 'Jugador',
    'leaderboard.points': 'Puntos',
    'leaderboard.bets': 'Apuestas Totales',
    'leaderboard.wins': 'Ganadas',
    'leaderboard.successRate': 'Tasa de Éxito',
    'leaderboard.you': 'Tú',
    
    // History
    'history.title': 'Historial de Apuestas',
    'history.all': 'Todas',
    'history.won': 'Ganadas',
    'history.lost': 'Perdidas',
    'history.pending': 'Pendientes',
    'history.bet': 'Apuesta',
    'history.amount': 'Cantidad',
    'history.option': 'Opción',
    'history.status': 'Estado',
    'history.date': 'Fecha',
    'history.noBets': 'No se encontró historial de apuestas',
    'history.stats.title': 'Tus Estadísticas',
    'history.stats.total': 'Apuestas Totales',
    'history.stats.won': 'Apuestas Ganadas',
    'history.stats.lost': 'Apuestas Perdidas',
    'history.stats.pending': 'Apuestas Pendientes',
    'history.stats.winRate': 'Tasa de Ganadas',
    'history.stats.totalWon': 'Puntos Totales Ganados',
    'history.stats.totalLost': 'Puntos Totales Perdidos',
    'history.stats.netGain': 'Ganancia/Pérdida Neta',
    
    // Bet statuses
    'bet.open': 'Abierta',
    'bet.closed': 'Cerrada',
    'bet.resolved': 'Resuelta',
    'bet.cancelled': 'Cancelada',
    
    // Betting interface
    'bet.availablePoints': 'Puntos Disponibles',
    'bet.pool': 'Bote',
    'bet.totalPool': 'Bote Total',
    'bet.betAmount': 'Cantidad a Apostar (Puntos)',
    'bet.potentialWinnings': 'Ganancia Potencial',
    'bet.placeBet': 'Apostar',
    'bet.placingBet': 'Apostando...',
    'bet.pointsStaked': 'puntos apostados',
    'bet.potential': 'potencial',
    'bet.noBeetsFound': 'No se encontraron apuestas que coincidan con tus filtros.',
    'bet.failedToPlace': 'Error al realizar la apuesta',
    
    // Categories
    'category.sports': 'Deportes',
    'category.politics': 'Política',
    'category.technology': 'Tecnología',
    'category.cryptocurrency': 'Criptomoneda',
    'category.entertainment': 'Entretenimiento',
    'category.weather': 'Clima',
    'category.socialMedia': 'Redes Sociales',
    'category.finance': 'Finanzas',
    
    // Admin Panel
    'admin.title': 'Panel de Administración',
    'admin.subtitle': 'Gestiona categorías de apuestas, crea nuevas apuestas y monitorea la actividad de la plataforma.',
    'admin.createBet': 'Crear Nueva Apuesta',
    'admin.manageCategories': 'Gestionar Categorías',
    'admin.createBettingMarket': 'Crear Nuevo Mercado de Apuestas',
    'admin.betTitle': 'Título de la Apuesta',
    'admin.category': 'Categoría',
    'admin.selectCategory': 'Selecciona una categoría',
    'admin.description': 'Descripción',
    'admin.descriptionPlaceholder': 'Proporciona una descripción detallada del mercado de apuestas...',
    'admin.bettingOptions': 'Opciones de Apuesta',
    'admin.option': 'Opción',
    'admin.odds': 'Cuotas',
    'admin.addOption': 'Agregar Opción',
    'admin.removeOption': 'Eliminar Opción',
    'admin.createBetButton': 'Crear Apuesta',
    'admin.creating': 'Creando...',
    'admin.fillRequired': 'Por favor completa todos los campos obligatorios',
    'admin.fillOptions': 'Por favor completa todas las opciones de apuesta con cuotas válidas',
    'admin.betCreated': '¡Apuesta creada exitosamente!',
    'admin.failedToCreate': 'Error al crear la apuesta',
    
    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.cancel': 'Cancelar',
    'common.confirm': 'Confirmar',
    'common.points': 'puntos',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'es'>(() => {
    const saved = localStorage.getItem('language');
    return (saved as 'en' | 'es') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};