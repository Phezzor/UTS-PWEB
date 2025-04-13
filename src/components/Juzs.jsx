import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { motion } from "framer-motion";

function Juzs() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [groupedAyat, setGroupedAyat] = useState({});
  const [surahDetails, setSurahDetails] = useState({});
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingTranslation, setLoadingTranslation] = useState(false);

  const convertToArabic = (num) =>
    num.toString().replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);

  const groupBySurah = (verses) => {
    const grouped = {};
    verses.forEach((verse) => {
      const [surahNumber] = verse.verse_key.split(":");
      if (!grouped[surahNumber]) grouped[surahNumber] = [];
      grouped[surahNumber].push(verse);
    });
    setGroupedAyat(grouped);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [versesRes, chaptersRes] = await Promise.all([
          fetch(
            `https://api.quran.com/api/v4/quran/verses/uthmani?juz_number=${id}`
          ),
          fetch(`https://api.quran.com/api/v4/chapters`),
        ]);

        const versesData = await versesRes.json();
        const chaptersData = await chaptersRes.json();

        groupBySurah(versesData.verses);

        const details = {};
        chaptersData.chapters.forEach((chapter) => {
          details[chapter.id] = {
            arabic: chapter.name_arabic,
            latin: chapter.name_simple,
            place: chapter.revelation_place.toUpperCase(),
            totalAyat: chapter.verses_count,
          };
        });
        setSurahDetails(details);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchTranslations = async () => {
      const transData = {};
      setLoadingTranslation(true);
      try {
        await Promise.all(
          Object.values(groupedAyat)
            .flat()
            .map(async (verse) => {
              const res = await fetch(
                `https://api.quran.com/api/v4/quran/translations/131?verse_key=${verse.verse_key}`
              );
              const data = await res.json();
              if (data.translations?.length) {
                transData[verse.verse_key] = data.translations[0].text;
              } else {
                transData[verse.verse_key] = "Terjemahan tidak ditemukan.";
              }
            })
        );
      } catch (error) {
        console.error("Translation error:", error);
      } finally {
        setTranslations(transData);
        setLoadingTranslation(false);
      }
    };

    if (Object.keys(groupedAyat).length > 0) fetchTranslations();
  }, [groupedAyat]);

  return (
    <div className="relative min-h-screen w-full">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1711202675843-ccdb194d2b7d?q=80&w=2070&auto=format&fit=crop')] bg-center bg-fixed bg-cover"></div>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-white text-center p-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          className="text-5xl font-bold mb-4 prompt-semibold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Juz {id}
        </motion.h1>

        <motion.div
          className="flex justify-between w-full max-w-4xl mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <button
            onClick={() => navigate("/juz")}
            className="px-4 py-2 bg-white/20 rounded-lg shadow hover:bg-[#847468] transition prompt-extralight-italic"
          >
            <IoIosArrowBack className="inline-block mr-1 cursor-pointer" />
            Back
          </button>

          <div className="flex gap-3">
            {parseInt(id) > 1 && (
              <button
                onClick={() => navigate(`/juz/${parseInt(id) - 1}`)}
                className="px-4 py-2 bg-white/20 rounded-lg shadow hover:bg-[#847468] transition"
              >
                <IoIosArrowBack className="inline-block cursor-pointer" />
              </button>
            )}
            {parseInt(id) < 30 && (
              <button
                onClick={() => navigate(`/juz/${parseInt(id) + 1}`)}
                className="px-4 py-2 bg-white/20 rounded-lg shadow hover:bg-[#847468] transition"
              >
                <IoIosArrowForward className="inline-block cursor-pointer" />
              </button>
            )}
          </div>
        </motion.div>

        {(loading || loadingTranslation) ? (
          <p className="text-gray-300">Memuat ayat dan terjemahan...</p>
        ) : (
          <motion.div
            className="space-y-12 max-w-4xl w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {Object.entries(groupedAyat).map(([surahNum, ayatList]) => {
              const surah = surahDetails[surahNum] || {};
              return (
                <div
                  key={surahNum}
                  className="bg-white/20 p-6 rounded-2xl shadow-md transition text-left"
                >
                  <h2 className="text-3xl font-bold text-white mb-1 noto">
                    {surah.arabic || "Surah"} ({surah.latin})
                  </h2>
                  <p className="italic text-sm text-gray-300 mb-4 poppins-light-italic">
                    {surah.place} - {ayatList.length} Ayat
                  </p>

                  <div className="space-y-4">
                    {ayatList.map((ayat) => (
                      <div
                        key={ayat.verse_key}
                        className="bg-white/10 p-4 rounded-xl poppins-light-italic"
                      >
                        <div className="flex justify-between items-start">
                          <p className="text-2xl text-right w-full font-bold leading-loose noto">
                            {ayat.text_uthmani}
                            <span className="ml-2 text-sm text-gray-300">
                              ({convertToArabic(ayat.verse_key.split(":")[1])})
                            </span>
                          </p>
                        </div>
                        <p
                          className="text-left text-sm mt-10 text-white poppins-light-italic"
                          dangerouslySetInnerHTML={{
                            __html:
                              translations[ayat.verse_key] ||
                              "Terjemahan tidak tersedia.",
                          }}
                        ></p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default Juzs;
