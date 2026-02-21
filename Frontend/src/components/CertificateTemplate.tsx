import React from 'react';
import { Award, ShieldCheck, Trophy } from 'lucide-react';

interface CertificateTemplateProps {
    studentName: string;
    courseTitle: string;
    date: string;
    instructor: string;
    certificateId: string;
    score: number;
}

export const CertificateTemplate: React.FC<CertificateTemplateProps> = ({
    studentName,
    courseTitle,
    date,
    instructor,
    certificateId,
    score
}) => {
    return (
        <div id="certificate-template" className="w-[1123px] h-[794px] bg-white p-12 relative overflow-hidden" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
            {/* Elegant Border */}
            <div className="absolute inset-0 border-[20px] border-emerald-900/5 transition-colors duration-300"></div>
            <div className="absolute inset-4 border-[2px] border-emerald-600/20"></div>

            {/* Background Accents (Subtle) */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-50 rounded-full blur-3xl opacity-50"></div>

            {/* Corner Embellishments */}
            <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-brand-600"></div>
            <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-brand-600"></div>

            <div className="relative z-10 h-full flex flex-col items-center justify-between text-center py-8">
                {/* Header */}
                <div className="space-y-4">
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center shadow-xl">
                            <img src="/static/EEUEZ-logo.png" alt="EEUEZ" className="w-10 h-10 object-contain brightness-0 invert"
                                onError={(e) => e.currentTarget.src = 'https://eeuez.com/static/EEUEZ-logo.png'} />
                        </div>
                    </div>
                    <h1 className="text-3xl font-black tracking-widest text-emerald-900 uppercase">
                        EEUEZ ACADEMY
                    </h1>
                    <div className="w-24 h-1 bg-brand-600 mx-auto rounded-full"></div>
                </div>

                {/* Main Content */}
                <div className="space-y-6">
                    <p className="text-xl font-medium text-slate-500 uppercase tracking-[0.2em]">
                        Certificat de Réussite
                    </p>

                    <div className="space-y-2">
                        <p className="text-slate-400 font-medium">Félicitations à</p>
                        <h2 className="text-6xl font-black text-slate-900 tracking-tight">
                            {studentName}
                        </h2>
                    </div>

                    <div className="max-w-3xl mx-auto py-6 border-y border-emerald-100 italic">
                        <p className="text-xl text-slate-600">
                            Pour avoir complété avec succès le cursus de formation intensive en
                        </p>
                        <h3 className="text-3xl font-bold text-emerald-700 mt-4 uppercase">
                            {courseTitle}
                        </h3>
                    </div>

                    <div className="flex items-center justify-center gap-8 mt-4">
                        <div className="flex flex-col items-center">
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Score Final</span>
                            <span className="text-2xl font-black text-brand-600">{score}%</span>
                        </div>
                        <div className="w-px h-10 bg-emerald-100"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Date d'obtention</span>
                            <span className="text-2xl font-black text-slate-900">{date}</span>
                        </div>
                    </div>
                </div>

                {/* Footer / Signatures */}
                <div className="w-full max-w-4xl mx-auto flex items-end justify-between px-12">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-48 h-px bg-slate-300 mb-2"></div>
                        <p className="text-sm font-bold text-slate-900">{instructor}</p>
                        <p className="text-xs text-slate-400 uppercase">Instructeur Principal</p>
                    </div>

                    {/* Seal */}
                    <div className="relative flex items-center justify-center">
                        <div className="w-32 h-32 bg-brand-600 rounded-full flex items-center justify-center shadow-2xl relative">
                            <Award className="text-white w-16 h-16" />
                            {/* Seal Ridges */}
                            {[...Array(24)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-2 h-4 bg-brand-600/50 rounded-full"
                                    style={{
                                        transform: `rotate(${i * 15}deg) translateY(-60px)`
                                    }}
                                ></div>
                            ))}
                        </div>
                        <div className="absolute -bottom-8 whitespace-nowrap text-[10px] font-black tracking-widest text-brand-700 uppercase">
                            Vérifié par EEUEZ Security
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <div className="w-48 h-px bg-slate-300 mb-2"></div>
                        <p className="text-sm font-bold text-slate-900">Directeur Académique</p>
                        <p className="text-xs text-slate-400 uppercase">EEUEZ Academy</p>
                    </div>
                </div>

                {/* Certificate ID */}
                <div className="absolute bottom-12 right-12 opacity-30 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
                        Verify at: eeuez.com/verify • ID: {certificateId}
                    </span>
                </div>
            </div>
        </div>
    );
};
