import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { motion } from "framer-motion";

function JuzsList() {
  const [juzList, setJuzList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJuzs = async () => {
      try {
        const res = await fetch("https://api.quran.com/api/v4/juzs");
        const data = await res.json();
        const uniqueJuz = Array.from(
          new Map(data.juzs.map((juz) => [juz.juz_number, juz])).values()
        );
        setJuzList(uniqueJuz);
      } catch (err) {
        console.error("Gagal mengambil daftar Juz:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJuzs();
  }, []);

  if (loading) return <p className="text-white p-6">Loading daftar Juz...</p>;

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
          className="text-4xl font-bold mb-10 prompt-semibold-italic"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Daftar Juz
        </motion.h1>

        {/* Tombol kembali */}
        <motion.div
          className="flex justify-start w-full max-w-4xl mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-white/20 rounded-lg shadow hover:bg-[#847468] transition prompt-extralight-italic"
          >
            <IoIosArrowBack className="inline-block mr-1" />
            Home
          </button>
        </motion.div>

        {/* Grid Juz */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          {juzList.map((juz) => (
            <Link
              key={juz.juz_number}
              to={`/juz/${juz.juz_number}`}
              className="bg-white/20 p-6 rounded-xl hover:bg-[#847468] hover:scale-105 transition duration-300 shadow-lg"
            >
              <h2 className="text-2xl font-semibold mb-2 prompt-extralight-italic">
                Juz {juz.juz_number}
              </h2>
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default JuzsList;
