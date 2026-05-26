'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

interface EnhancedVoiceInterfaceProps {
  onVoiceInput: (text: string, confidence: number) => void;
  onVoiceOutput: (text: string) => void;
  autoSpeak?: boolean;
}

export function EnhancedVoiceInterface({
  onVoiceInput,
  onVoiceOutput,
  autoSpeak: _autoSpeak,
}: EnhancedVoiceInterfaceProps) {
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [voiceHistory, setVoiceHistory] = useState<
    Array<{ text: string; type: 'input' | 'output'; timestamp: Date }>
  >([]);
  const [volume, setVolume] = useState(0);

  const [voiceRate, setVoiceRate] = useState(1);
  const [voicePitch, setVoicePitch] = useState(1);
  const [voiceVolume, setVoiceVolume] = useState(1);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastProcessedTranscriptRef = useRef<string>('');
  const [visualizationBars, setVisualizationBars] = useState<number[]>(Array.from({ length: 64 }, () => 8));

  const {
    isListening: voiceIsListening,
    transcript: voiceTranscript,
    confidence: voiceConfidence,
    startListening,
    stopListening,
    isSupported: voiceSupported,
    error: voiceError,
  } = useVoiceRecognition();

  const {
    speak,
    isSpeaking: ttsIsSpeaking,
    stop: stopSpeaking,
    voices,
    setVoice,
    setRate,
    setPitch,
    setVolume: setTTSVolume,
  } = useTextToSpeech();

  // ✅ 使用派生状态替代 useEffect setState - 解决 React 19 严格模式警告
  const isListening = voiceIsListening;
  const isSpeaking = ttsIsSpeaking;
  const isSupported = voiceSupported && typeof window !== 'undefined' && 'speechSynthesis' in window;

  const setupAudioVisualization = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);

      microphoneRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 512;
      analyserRef.current.smoothingTimeConstant = 0.8;

      const updateVolume = () => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setVolume(average / 255);
        }
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (error) {
      console.error('音频可视化设置失败:', error);
    }
  }, []);

  // 清理音频资源
  const cleanupAudio = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  }, []);

  // 开始语音识别
  const handleStartListening = useCallback(async () => {
    await setupAudioVisualization();
    startListening();
  }, [setupAudioVisualization, startListening]);

  // 停止语音识别
  const handleStopListening = useCallback(() => {
    cleanupAudio();
    stopListening();
  }, [cleanupAudio, stopListening]);

  // ✅ 更新可视化柱状图 - 订阅定时器外部系统
  /* eslint-disable react-hooks/set-state-in-effect -- 定时器和事件回调中的状态更新是合理的 */
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setVisualizationBars(
          Array.from({ length: 64 }, (_, i) =>
            Math.max(8, volume * 100 + Math.random() * 30 + Math.sin(Date.now() / 100 + i) * 10)
          )
        );
      }, 100);

      return () => clearInterval(interval);
    } else {
      setVisualizationBars(Array.from({ length: 64 }, () => 8));
    }
  }, [isListening, volume]);

  // 处理语音输入 - 使用 ref 避免重复处理
  useEffect(() => {
    if (voiceTranscript && voiceTranscript !== lastProcessedTranscriptRef.current) {
      lastProcessedTranscriptRef.current = voiceTranscript;
      setTranscript(voiceTranscript);
      setConfidence(voiceConfidence);

      if (voiceTranscript.trim()) {
        const historyItem = {
          text: voiceTranscript,
          type: 'input' as const,
          timestamp: new Date(),
        };
        setVoiceHistory((prev) => [...prev, historyItem]);
        onVoiceInput(voiceTranscript, voiceConfidence);
      }
    }
  }, [voiceTranscript, voiceConfidence, onVoiceInput]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // 语音输出
  const handleSpeak = useCallback(
    (text: string) => {
      if (text.trim()) {
        const historyItem = {
          text,
          type: 'output' as const,
          timestamp: new Date(),
        };
        setVoiceHistory((prev) => [...prev, historyItem]);
        speak(text);
        onVoiceOutput(text);
      }
    },
    [speak, onVoiceOutput]
  );

  useEffect(() => {
    setRate(voiceRate);
    setPitch(voicePitch);
    setTTSVolume(voiceVolume);
  }, [voiceRate, voicePitch, voiceVolume, setRate, setPitch, setTTSVolume]);

  useEffect(() => {
    if (voices.length > 0 && selectedVoiceIndex < voices.length) {
      setVoice(voices[selectedVoiceIndex]!);
    }
  }, [selectedVoiceIndex, voices, setVoice]);

  // 清理资源
  useEffect(() => {
    return () => {
      cleanupAudio();
      stopSpeaking();
    };
  }, [cleanupAudio, stopSpeaking]);

  if (!isSupported) {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-center text-red-400">⚠️ 语音功能不支持</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-3">
          <p className="text-slate-400">您的浏览器不支持语音识别或语音合成功能</p>
          <p className="text-slate-500 text-sm">请使用Chrome、Edge或Safari浏览器以获得最佳体验</p>
          <div className="mt-4 p-4 bg-slate-900/50 rounded-lg border border-slate-600/50 text-left">
            <p className="text-sm text-slate-400">
              <strong className="text-slate-300">推荐浏览器：</strong>
            </p>
            <ul className="mt-2 space-y-1 text-sm text-slate-400">
              <li>• Google Chrome (推荐)</li>
              <li>• Microsoft Edge</li>
              <li>• Safari (macOS/iOS)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <span className="text-2xl">🎤</span>
              <span>智能语音交互</span>
            </span>
            <div className="flex items-center space-x-2">
              <Badge
                className={`transition-all duration-300 ${isListening ? 'bg-red-500/20 text-red-300 border-red-500/50 animate-pulse' : 'bg-slate-500/20 text-slate-300 border-slate-500/50'}`}
              >
                {isListening ? '🔴 录音中' : '⚫ 待机'}
              </Badge>
              {isSpeaking && (
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50 animate-pulse">
                  🔊 播放中
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <div className="relative w-full max-w-2xl h-40 bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-xl border border-slate-600/50 overflow-hidden shadow-2xl">
              <div className="absolute inset-0 flex items-end justify-center space-x-1 p-4">
                {visualizationBars.map((height, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-t from-cyan-500 via-blue-500 to-purple-500 rounded-sm transition-all duration-100 shadow-lg"
                    style={{
                      width: '4px',
                      height: `${height}%`,
                      opacity: isListening ? 0.9 : 0.3,
                      boxShadow: isListening ? `0 0 10px rgba(6, 182, 212, ${volume})` : 'none',
                    }}
                  />
                ))}
              </div>
              {isListening && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 animate-pulse" />
              )}
              {!isListening && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-slate-500 text-sm">点击开始录音按钮开始语音输入</p>
                </div>
              )}
            </div>
          </div>

          {voiceError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-300 text-sm flex items-center">
                <span className="mr-2">⚠️</span>
                {voiceError}
              </p>
            </div>
          )}

          <div className="flex justify-center space-x-4">
            <Button
              onClick={isListening ? handleStopListening : handleStartListening}
              className={`px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${
                isListening
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/50'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/50'
              }`}
            >
              {isListening ? (
                <>
                  <span className="mr-2 text-xl">⏹️</span>
                  停止录音
                </>
              ) : (
                <>
                  <span className="mr-2 text-xl">🎤</span>
                  开始录音
                </>
              )}
            </Button>

            {isSpeaking && (
              <Button
                onClick={stopSpeaking}
                variant="outline"
                className="px-6 py-6 border-slate-600/50 bg-slate-700/30 text-slate-300 hover:bg-slate-600/50 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <span className="mr-2 text-xl">🔇</span>
                停止播放
              </Button>
            )}
          </div>

          {transcript && (
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-xl p-5 border border-slate-600/50 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-400 font-medium">📝 实时转录</span>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/50 text-xs">
                  置信度: {Math.round(confidence * 100)}%
                </Badge>
              </div>
              <p className="text-slate-100 text-lg leading-relaxed">{transcript}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-sm text-slate-300">🎚️ 语音参数调节</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-slate-400">语速</label>
                    <span className="text-xs text-slate-300">{voiceRate.toFixed(1)}x</span>
                  </div>
                  <Slider
                    value={[voiceRate]}
                    onValueChange={([value]) => setVoiceRate(value ?? 1)}
                    min={0.5}
                    max={2}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-slate-400">音调</label>
                    <span className="text-xs text-slate-300">{voicePitch.toFixed(1)}</span>
                  </div>
                  <Slider
                    value={[voicePitch]}
                    onValueChange={([value]) => setVoicePitch(value ?? 1)}
                    min={0.5}
                    max={2}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-slate-400">音量</label>
                    <span className="text-xs text-slate-300">{Math.round(voiceVolume * 100)}%</span>
                  </div>
                  <Slider
                    value={[voiceVolume]}
                    onValueChange={([value]) => setVoiceVolume(value ?? 0.5)}
                    min={0}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-sm text-slate-300">🗣️ 语音选择</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  value={selectedVoiceIndex.toString()}
                  onValueChange={(value) => setSelectedVoiceIndex(Number.parseInt(value))}
                >
                  <SelectTrigger className="w-full bg-slate-800/50 border-slate-600/50 text-slate-200">
                    <SelectValue placeholder="选择语音" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {voices.map((voice, index) => (
                      <SelectItem
                        key={index}
                        value={index.toString()}
                        className="text-slate-200 hover:bg-slate-700"
                      >
                        {voice.name} ({voice.lang})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="text-xs text-slate-400 space-y-1">
                  <p>• 共有 {voices.length} 个可用语音</p>
                  <p>• 推荐使用中文语音以获得最佳体验</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSpeak('您好，我是YYC³ AI助手，很高兴为您服务！')}
              className="border-slate-600/50 bg-slate-700/30 text-slate-300 hover:bg-slate-600/50 transition-all duration-200"
            >
              🤖 问候语
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSpeak('语音功能测试成功，系统运行正常。')}
              className="border-slate-600/50 bg-slate-700/30 text-slate-300 hover:bg-slate-600/50 transition-all duration-200"
            >
              ✅ 测试语音
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSpeak('正在启动文生图引擎，请稍候...')}
              className="border-slate-600/50 bg-slate-700/30 text-slate-300 hover:bg-slate-600/50 transition-all duration-200"
            >
              🎨 功能提示
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSpeak('感谢使用YYC³ AI Center，祝您使用愉快！')}
              className="border-slate-600/50 bg-slate-700/30 text-slate-300 hover:bg-slate-600/50 transition-all duration-200"
            >
              👋 结束语
            </Button>
          </div>
        </CardContent>
      </Card>

      {voiceHistory.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <span>📜</span>
                <span>语音交互历史</span>
                <Badge className="bg-slate-600/50 text-slate-300 text-xs">
                  {voiceHistory.length} 条记录
                </Badge>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setVoiceHistory([])}
                className="border-slate-600/50 bg-slate-700/30 text-slate-300 hover:bg-slate-600/50 transition-all duration-200"
              >
                🗑️ 清空历史
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="space-y-3 max-h-80 overflow-y-auto scroll-smooth pr-2"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(59, 130, 246, 0.5) rgba(0, 0, 0, 0.2)',
              }}
            >
              {voiceHistory.map((item, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                    item.type === 'input'
                      ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30'
                      : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{item.type === 'input' ? '🎤' : '🔊'}</div>
                    <div className="flex-1">
                      <p className="text-slate-200 text-sm leading-relaxed">{item.text}</p>
                      <p className="text-slate-400 text-xs mt-2 flex items-center space-x-2">
                        <span>{item.type === 'input' ? '语音输入' : '语音输出'}</span>
                        <span>•</span>
                        <span>{item.timestamp.toLocaleTimeString()}</span>
                      </p>
                    </div>
                    {item.type === 'output' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSpeak(item.text)}
                        className="text-slate-400 hover:text-slate-200 transition-colors duration-200"
                        title="重新播放"
                      >
                        🔄
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 使用说明 */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle>💡 语音交互使用指南</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-slate-200 mb-2">🎤 语音输入</h4>
              <ul className="space-y-1 text-slate-400">
                <li>• 点击"开始录音"按钮开始语音输入</li>
                <li>• 清晰地说出您的需求</li>
                <li>• 系统会实时显示转录结果</li>
                <li>• 点击"停止录音"完成输入</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 mb-2">🔊 语音输出</h4>
              <ul className="space-y-1 text-slate-400">
                <li>• AI回复会自动转换为语音播放</li>
                <li>• 可以点击快速测试按钮体验</li>
                <li>• 支持中断和重新播放功能</li>
                <li>• 历史记录可重复播放</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-slate-600/50">
            <p className="text-slate-300">
              <span className="font-semibold">💡 提示：</span>
              为获得最佳体验，请在安静环境中使用语音功能，并确保麦克风权限已开启。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
