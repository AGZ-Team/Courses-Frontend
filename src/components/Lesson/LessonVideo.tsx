'use client';

import { useState, useRef } from 'react';
import { Play, Clock, Volume2, Download, Share2, ThumbsUp, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface LessonVideoProps {
  title: string;
  description: string;
  videoId: string;
  thumbnailUrl?: string;
  duration: string;
}

export function LessonVideo({
  title,
  description,
  videoId,
  thumbnailUrl = '/coursesImages/4.png',
  duration
}: LessonVideoProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('lessonPage.video');

  return (
    <div className="mb-8">
      <div
        ref={videoRef}
        className="relative w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl group"
        style={{ aspectRatio: '16 / 9' }}
      >
        {/* Video Background */}
        <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
          <Image 
            src={thumbnailUrl}
            alt="Course"
            width={500}
            height={500}
            className="w-full h-full object-cover opacity-40"
          />
        </div>

        {/* Play Button Overlay */}
        {!isVideoPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
            <button
              onClick={() => setIsVideoPlaying(true)}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300"
            >
              <Play className="w-8 h-8 text-primary fill-primary ml-1" />
            </button>
          </div>
        )}

        {/* Video Player */}
        {isVideoPlaying && (
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title="Lesson Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}

        {/* Video Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{duration}</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="hover:text-yellow-400 transition-colors">
                <Volume2 className="w-5 h-5" />
              </button>
           
            </div>
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="mt-6 space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
          <p className="text-slate-600">{description}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 pt-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-medium">
            <Share2 className="w-4 h-4" />
            {t('share')}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium">
            <ThumbsUp className="w-4 h-4" />
            {t('like')}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium">
            <MessageCircle className="w-4 h-4" />
            {t('comment')}
          </button>
        </div>
      </div>
    </div>
  );
}
