import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MdHome } from "react-icons/md";


function home() {
  const [surah, setSurah] = useState([]);
  const [juzs, setJuzs] = useState([]);
  const [selectedJuz, setSelectedJuz] = useState(() => {
    const stored = localStorage.getItem("selectedJuz");
    return stored ? parseInt(stored) : null;
  });
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://api.quran.com/api/v4/chapters")
      .then((response) => response.json())
      .then((data) => setSurah(data.chapters))
      .catch((error) => console.error("Error fetching chapters:", error));
  }, []);

  useEffect(() => {
    fetch("https://api.quran.com/api/v4/juzs")
      .then((response) => response.json())
      .then((data) => {
        const uniqueJuzs = Array.from(
          new Map(data.juzs.map((juz) => [juz.juz_number, juz])).values()
        );
        setJuzs(uniqueJuzs);
      })
      .catch((error) => console.error("Error fetching juzs:", error));
  }, []);

  useEffect(() => {
    if (selectedJuz !== null) {
      localStorage.setItem("selectedJuz", selectedJuz);
    }
  }, [selectedJuz]);

  const filteredSurah = surah.filter((s) => {
    const inJuz = selectedJuz
      ? juzs.find((j) => j.juz_number === selectedJuz)?.verse_mapping[s.id]
      : true;
    const matchesSearch = s.name_simple
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return inJuz && matchesSearch;
  });

  return (
    <div className="relative min-h-screen w-full">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1711202675843-ccdb194d2b7d?q=80&w=2070&auto=format&fit=crop')] bg-center bg-fixed bg-cover"></div>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white text-center p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          className="text-5xl font-bold mb-10 poppins-regular-italic"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Kalam <span className="text-[#C0AC94]">Ilahi</span> Qur'an
        </motion.h1>

        <motion.h2
          className="text-4xl prompt-semibold mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
        >
          Daftar Surah
        </motion.h2>

        {/* Filter Bar */}
        <motion.div
          className="flex flex-wrap gap-3 items-start w-full max-w-4xl mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
        >
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-white rounded-lg shadow hover:transition duration-300 ease-in-out cursor-pointer prompt-extralight-italic hover:bg-[#847468]"
          >
            <MdHome className="text-3xl text-[#847468] hover:text-white"/>
          </button>

          <select
            className="p-2 rounded-lg text-white bg-[#847468] shadow-xl cursor-pointer w-40 prompt-extralight-italic"
            onChange={(e) =>
              setSelectedJuz(e.target.value ? parseInt(e.target.value) : null)
            }
            value={selectedJuz || ""}
          >
            <option value="">Semua Juz</option>
            {juzs.map((juz) => (
              <option key={juz.juz_number} value={juz.juz_number}>
                Juz {juz.juz_number}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Cari Surah..."
            className="p-2 flex-1 rounded-lg text-white shadow-xl text-center"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </motion.div>

        {/* Surah Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
        >
          {filteredSurah.length > 0 ? (
            filteredSurah.map((surah) => (
              <Link
                key={surah.id}
                to={`/surah/${surah.id}`}
                className="bg-white/20 p-6 rounded-xl shadow-md text-white flex flex-col items-center cursor-pointer hover:scale-110 transition duration-300 ease-in-out hover:bg-[#847468]"
              >
                <div className="flex items-start gap-2">
                  <p className="text-lg font-semibold noto">{surah.id}.</p>
                  <h2 className="text-2xl noto">{surah.name_arabic}</h2>
                </div>
                <p className="text-sm prompt-regular-italic">
                  {surah.name_complex} - ({surah.verses_count} Ayat)
                </p>
                <p className="text-md prompt-regular-italic mt-2">
                  {surah.translated_name.name}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-xl text-white">Surah tidak ditemukan</p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default home;
