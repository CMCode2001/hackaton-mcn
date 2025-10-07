import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { QrCode, ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getOeuvresFromLocalData } from '../api/api';
import { Oeuvre } from '../types/models';

export function Home() {
  const { t, i18n } = useTranslation();
  const [featuredOeuvres, setFeaturedOeuvres] = useState<Oeuvre[]>([]);

  useEffect(() => {
    const loadFeatured = async () => {
      const oeuvres = await getOeuvresFromLocalData();
      setFeaturedOeuvres(oeuvres.slice(0, 3));
    };
    loadFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">{t('app.tagline')}</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              {t('home.hero')}
            </h1>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              {t('home.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/scan"
                className="inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <QrCode className="w-6 h-6" />
                {t('home.scanCta')}
              </Link>

              <Link
                to="/oeuvres"
                className="inline-flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all duration-200"
              >
                {t('home.exploreAll')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {featuredOeuvres.length > 0 && (
            <div className="mt-20">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                {t('home.featuredTitle')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredOeuvres.map((oeuvre) => {
                  const description = oeuvre.descriptions.find(
                    (d) => d.langue === i18n.language
                  ) || oeuvre.descriptions[0];

                  return (
                    <Link
                      key={oeuvre.id}
                      to={`/oeuvres/${oeuvre.id}`}
                      className="group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    >
                      <div className="aspect-square bg-gradient-to-br from-blue-900/50 to-purple-900/50 relative overflow-hidden">
                        {oeuvre.imageUrl ? (
                          <img
                            src={oeuvre.imageUrl}
                            alt={oeuvre.titre}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Sparkles className="w-20 h-20 text-white/30" />
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                          {oeuvre.titre}
                        </h3>
                        <p className="text-gray-400 mb-3">{oeuvre.auteur}</p>
                        <p className="text-gray-300 text-sm line-clamp-2">
                          {description?.texteComplet}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
