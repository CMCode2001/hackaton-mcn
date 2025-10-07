import { useTranslation } from 'react-i18next';
import { Building2 } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-400" />
            <span className="font-semibold text-white">{t('app.title')}</span>
          </div>

          <p className="text-sm text-center">
            © {year} {t('app.title')}. Progressive Web App.
          </p>

          <p className="text-sm text-gray-400">{t('app.tagline')}</p>
        </div>
      </div>
    </footer>
  );
}
