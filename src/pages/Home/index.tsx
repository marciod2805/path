import React from 'react';
import { Link } from 'react-router-dom';
import { Sword, Map, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col items-center justify-center p-6">
            <div className="max-w-4xl w-full space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                        Completionist Hub
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Select your adventure
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <Link to="/games/witcher-3" className="group relative overflow-hidden rounded-2xl bg-[#1a1a1a] border border-[#333] hover:border-[#a81c1c] transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/20">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                        <img
                            src="https://image.api.playstation.com/vulcan/ap/rnd/202211/0711/kh4MUIuMmHAvktZpsLizPTtt.jpg"
                            alt="Witcher 3"
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-80"
                        />
                        <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-2xl font-bold text-white group-hover:text-[#ff4d4d] transition-colors">The Witcher 3</h2>
                                <ArrowRight className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                            </div>
                            <p className="text-sm text-gray-300 mb-4">Wild Hunt + DLCs</p>
                            <div className="flex gap-3">
                                <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider bg-black/50 px-2 py-1 rounded border border-white/10">
                                    <Sword className="w-3 h-3" /> Missables
                                </span>
                                <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider bg-black/50 px-2 py-1 rounded border border-white/10">
                                    <Map className="w-3 h-3" /> Maps
                                </span>
                            </div>
                        </div>
                    </Link>


                    <div className="relative overflow-hidden rounded-2xl bg-[#111] border border-[#222] flex items-center justify-center h-64 opacity-50 cursor-not-allowed">
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-bold text-gray-600">More Games Coming Soon</h3>
                            <p className="text-sm text-gray-700"></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
