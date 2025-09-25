import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, Download } from 'lucide-react';
import { AUDIO_SETTINGS, UI_TEXT } from '../../constants';

const AudioRecorder = ({
  onAudioRecorded,
  maxDuration = AUDIO_SETTINGS.MAX_DURATION,
  currentAudio = null,
  className = ""
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(currentAudio);
  const [error, setError] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl && !currentAudio) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl, currentAudio]);

  const startRecording = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: AUDIO_SETTINGS.MIME_TYPE });

        if (audioUrl && !currentAudio) {
          URL.revokeObjectURL(audioUrl);
        }

        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        onAudioRecorded(blob);

        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          if (newTime >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return newTime;
        });
      }, 1000);

    } catch (err) {
      setError(UI_TEXT.MICROPHONE_ERROR);
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const deleteRecording = () => {
    if (audioUrl && !currentAudio) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setRecordingTime(0);
    setIsPlaying(false);
    onAudioRecorded(null);
  };

  const downloadAudio = () => {
    if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `recording-${Date.now()}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Recording Controls */}
      <div className="flex items-center space-x-4">
        {!isRecording && !audioUrl && (
          <button
            onClick={startRecording}
            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Mic className="h-4 w-4" />
            <span>{UI_TEXT.RECORD}</span>
          </button>
        )}

        {isRecording && (
          <div className="flex items-center space-x-4">
            <button
              onClick={stopRecording}
              className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Square className="h-4 w-4" />
              <span>{UI_TEXT.STOP}</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-mono text-gray-600">
                {formatTime(recordingTime)} / {formatTime(maxDuration)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Audio Player */}
      {audioUrl && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={playAudio}
                className="flex items-center justify-center w-10 h-10 bg-primary-500 hover:bg-primary-600 text-white rounded-full transition-colors"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 ml-0.5" />
                )}
              </button>
              
              <div className="text-sm text-gray-600">
                {currentAudio ? UI_TEXT.EXISTING_AUDIO : `${UI_TEXT.AUDIO_RECORDING} (${formatTime(recordingTime)})`}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {!currentAudio && (
                <button
                  onClick={downloadAudio}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Télécharger"
                >
                  <Download className="h-4 w-4" />
                </button>
              )}
              
              <button
                onClick={deleteRecording}
                className="p-2 text-red-500 hover:text-red-700 transition-colors"
                title="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        </div>
      )}

      {/* Instructions */}
      {!audioUrl && !isRecording && (
        <div className="text-xs text-gray-500">
          {UI_TEXT.RECORDING_INSTRUCTIONS.replace('{maxDuration}', maxDuration)}
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;