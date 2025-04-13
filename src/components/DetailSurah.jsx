import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./style.css";
import { IoPlayCircleSharp } from "react-icons/io5";
import { MdPauseCircle } from "react-icons/md";


function DetailSurah() {
  const { surahId } = useParams();
  const navigate = useNavigate();
  const [verses, setVerses] = useState([]);
  const [surah, setSurah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [reciters, setReciters] = useState([]);
  const [selectedReciter, setSelectedReciter] = useState(1);
  const [arti, setArti] = useState([]);

  const convertToArabicNumber = (num) => {
    return num.toString().replace(/[0-9]/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[digit]);
  };

  useEffect(() => {
    if (surahId) {
      setLoading(true);
      fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${surahId}`)
        .then((response) => response.json())
        .then((data) => {
          setVerses(data.verses || []);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching verses:", error);
          setLoading(false);
        });
    }
  }, [surahId]);

  useEffect(() => {
    fetch(`https://api.quran.com/api/v4/chapters/${surahId}`)
      .then((response) => response.json())
      .then((data) => setSurah(data.chapter))
      .catch((error) => console.error("Error fetching surah:", error));
  }, [surahId]);

  useEffect(() => {
    fetch("https://api.quran.com/api/v4/resources/recitations")
      .then((response) => response.json())
      .then((data) => setReciters(data.recitations))
      .catch((error) => console.error("Error fetching reciters:", error));
  }, []);

  useEffect(() => {
    if (selectedReciter && surahId) {
      fetch(`https://api.quran.com/api/v4/chapter_recitations/${selectedReciter}/${surahId}`)
        .then((response) => response.json())
        .then((data) => setAudioUrl(data.audio_file.audio_url))
        .catch((error) => console.error("Error fetching audio:", error));
    }
  }, [selectedReciter, surahId]);

  useEffect(() => {
    fetch("http://api.alquran.cloud/v1/quran/en.asad")
      .then((response) => response.json())
      .then((data) => {
        const surahTranslation = data.data.surahs.find((s) => s.number.toString() === surahId);
        setArti(surahTranslation ? surahTranslation.ayahs : []);
      })
      .catch((error) => console.error("Error fetching translations:", error));
  }, [surahId]);

  const toggleAudio = () => {
    if (!audioUrl) return;

    if (!audio) {
      const newAudio = new Audio(audioUrl);
      setAudio(newAudio);
      newAudio.play();
      setIsPlaying(true);
      newAudio.onended = () => setIsPlaying(false);
    } else {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative min-h-screen w-full">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1711202675843-ccdb194d2b7d?q=80&w=2070&auto=format&fit=crop')] bg-center bg-fixed bg-cover"></div>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <motion.div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white text-center p-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 px-4 py-2 text-white rounded-lg hover:scale-110 transition duration-300 flex items-center prompt-regular-italic cursor-pointer z-20"
          >
            <img
              src="https://img.icons8.com/?size=100&id=99287&format=png&color=FFFFFF"
              alt="Kembali"
              className="w-6 h-6 mr-2"
            />
            Back
          </button>

        <h2 className="text-4xl font-bold mb-2 noto">
          {surah ? surah.name_complex : "Memuat..."}
        </h2>
        <p className="text-lg text-gray-300 mb-6 prompt-regular-italic">
          {surah ? `${surah.name_simple} - ${surah.verses_count} Ayat` : ""}
        </p>

        <select
          value={selectedReciter}
          onChange={(e) => setSelectedReciter(e.target.value)}
          className="px-4 py-2 mb-4 bg-white text-black rounded-lg shadow-md cursor-pointer"
        >
          {reciters.map((reciter) => (
            <option key={reciter.id} value={reciter.id}>
              {reciter.reciter_name}
            </option>
          ))}
        </select>

        {audioUrl && (
          <button
            onClick={toggleAudio}
            className="mb-6 text-white rounded-lg shadow-lg hover:scale-115 transition duration-300 cursor-pointer hover:text-black "
          >
            {isPlaying ? <MdPauseCircle className="text-4xl"/> : <IoPlayCircleSharp className="text-4xl"/>}
          </button>
        )}

        {loading ? (
          <p className="text-gray-300">Memuat ayat...</p>
        ) : (
          <motion.div
            className="max-w-3xl space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {verses.map((verse, index) => (
              <div
                key={verse.id}
                className="p-4 bg-white/20 rounded-lg shadow-md"
              >
                <div className="flex items-center justify-end">
                  <span className="text-lg text-gray-300 arabic-number mr-2">
                    {convertToArabicNumber(verse.verse_key)}
                  </span>
                  <p className="text-2xl noto text-right">
                    {verse.text_uthmani}
                  </p>
                </div>
                <p className="text-md text-gray-200 text-left mt-2 italic">
                  {arti[index] ? arti[index].text : "Terjemahan tidak tersedia"}
                </p>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default DetailSurah;
