import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Loby() {
    return (
        <div className="relative min-h-screen w-full">
            {/* Background */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1711202675843-ccdb194d2b7d?q=80&w=2070&auto=format&fit=crop')] bg-center bg-fixed bg-cover"></div>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

            {/* Content */}
            <motion.div
                className="relative z-10 p-6 text-white flex flex-col items-center justify-center min-h-screen"
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

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-3xl w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                >
                    {/* Grid untuk Surah */}
                    <Link
                        to="/home"
                        className="bg-white/20 p-10 rounded-2xl text-center text-white hover:bg-[#847468] hover:scale-105 transition duration-300 shadow-lg"
                    >
                        <h2 className="text-3xl font-bold mb-2 noto">Daftar Surah</h2>
                        <p className="text-md prompt-extralight-italic">
                            Lihat daftar surah dalam Al-Qur'an
                        </p>
                    </Link>

                    {/* Grid untuk Juz */}
                    <Link
                        to="/juz"
                        className="bg-white/20 p-10 rounded-2xl text-center text-white hover:bg-[#847468] hover:scale-105 transition duration-300 shadow-lg"
                    >
                        <h2 className="text-3xl font-bold mb-2 noto">Daftar Juz</h2>
                        <p className="text-md prompt-extralight-italic">
                            Lihat daftar Juz dalam Al-Qur'an
                        </p>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default Loby;
