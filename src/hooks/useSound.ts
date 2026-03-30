import { useCallback } from 'react'
import { useSettingsStore } from '../store/useSettingsStore'

const audioCtx = typeof window !== 'undefined'
  ? new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  : null

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) {
  if (!audioCtx) return
  const oscillator = audioCtx.createOscillator()
  const gainNode = audioCtx.createGain()
  oscillator.connect(gainNode)
  gainNode.connect(audioCtx.destination)
  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime)
  gainNode.gain.setValueAtTime(volume, audioCtx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration)
  oscillator.start(audioCtx.currentTime)
  oscillator.stop(audioCtx.currentTime + duration)
}

export function useSound() {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled)

  const playCorrect = useCallback(() => {
    if (!soundEnabled) return
    playTone(523, 0.15, 'sine')
    setTimeout(() => playTone(659, 0.15, 'sine'), 100)
    setTimeout(() => playTone(784, 0.3, 'sine'), 200)
  }, [soundEnabled])

  const playWrong = useCallback(() => {
    if (!soundEnabled) return
    playTone(200, 0.3, 'sawtooth', 0.2)
  }, [soundEnabled])

  const playStar = useCallback(() => {
    if (!soundEnabled) return
    playTone(880, 0.1, 'sine')
    setTimeout(() => playTone(1108, 0.1, 'sine'), 80)
    setTimeout(() => playTone(1320, 0.2, 'sine'), 160)
  }, [soundEnabled])

  const playClick = useCallback(() => {
    if (!soundEnabled) return
    playTone(600, 0.05, 'square', 0.1)
  }, [soundEnabled])

  const playLevelUp = useCallback(() => {
    if (!soundEnabled) return
    const notes = [523, 587, 659, 784, 880, 1047]
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.2, 'sine', 0.2), i * 100)
    })
  }, [soundEnabled])

  const playPageTurn = useCallback(() => {
    if (!soundEnabled) return
    playTone(300, 0.05, 'triangle', 0.1)
    setTimeout(() => playTone(400, 0.05, 'triangle', 0.08), 50)
  }, [soundEnabled])

  return { playCorrect, playWrong, playStar, playClick, playLevelUp, playPageTurn }
}
