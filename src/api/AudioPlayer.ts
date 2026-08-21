/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { findByCodeLazy, findLazy } from "@webpack";

let defaultSounds: null | string[] = null;
const findDefaultSounds = findLazy(module => module.resolve && module.id && module.keys().some(key => key.endsWith(".mp3")), false);
const AudioPlayerConstructor = findByCodeLazy("could not play audio");

export type AudioProcessor = (data: PreprocessAudioData) => void;
export type AudioCallback = (() => void);
export type AudioErrorHandler = ((error: Error) => void);
export const audioProcessorFunctions: Record<string, AudioProcessor> = {};

export enum AudioType {
    /** CSP-compliant external URL. */
    URL = "url",
    /** Base64 data URI. */
    DATA = "data-uri",
    /** Blob URI. */
    BLOB = "blob",
    /** Local file path. */
    PATH = "file-path",
    /** Built-in Discord audio filename, like "discodo". */
    DISCORD = "discord",
    /** Anything else we didn't recognise. */
    OTHER = "other"
}

export interface PreprocessAudioData {
    /** Audio string the player received. */
    audio: string;
    /** Detected audio type. Read-only. */
    readonly type: AudioType;
    /** Volume from 0 to 100. */
    volume: number;
    /** Playback speed from 0.0625 to 16. */
    speed: number;
}

export interface AudioPlayerInternal {
    preprocessDataOriginal: PreprocessAudioData;
    preprocessDataPrevious: PreprocessAudioData | null;
    preprocessDataCurrent: PreprocessAudioData;
    audio: string;
    _audio: null | Promise<HTMLAudioElement>;
    _volume: number;
    _speed: number;
    outputChannel: string;
    type: AudioType;
    preload: boolean;
    persistent: boolean;
    onEnded?: AudioCallback;
    onError?: AudioErrorHandler;
    processAudio: () => void;
    ensureAudio(): Promise<HTMLAudioElement>;
    destroyAudio(): void;
    loop(): void;
    play(): void;
    pause(): void;
    stop(restart?: boolean): void;
}

export interface AudioPlayerInterface {
    /** Audio to play: a built-in Discord filename, a data URI, or a CSP-compliant URL. */
    audio: string;
    /** Audio type detected during processing. Read-only. */
    readonly type: AudioType;
    /** Duration in seconds, or null while loading. */
    readonly duration: Promise<number> | null;
    /** Current playback time in seconds, or null while loading. */
    time: Promise<number> | null;
    /** Whether the audio is paused, or null while loading. */
    paused: Promise<boolean> | null;
    /** Whether the audio is muted, or null while loading. */
    muted: Promise<boolean> | null;
    /** Volume from 0 to 100. */
    volume: number;
    /** Playback speed from 0.0625 to 16. */
    speed: number;
    /** Load the audio as soon as the player is created. If not persistent, this only lasts until the first play. */
    preload: boolean;
    /** Keep the audio element alive between plays. If true, call delete() to free it. */
    persistent: boolean;
    /** Preload the audio. Called automatically when persistent is true. */
    load(): void;
    /** Loop the audio until paused or stopped. */
    loop(): void;
    /** Play the audio. */
    play(): void;
    /** Pause the audio. */
    pause(): void;
    /** Stop the audio. */
    stop(): void;
    /** Restart playback from the beginning. */
    restart(): void;
    /** Jump to a position in seconds. */
    seek(time: number): void;
    /** Mute the audio. */
    mute(): void;
    /** Unmute the audio. */
    unmute(): void;
    /** Destroy the audio element. Required if persistent is true. */
    delete(): void;
}

export interface AudioPlayerOptions {
    /** Volume from 0 to 100. Defaults to 100. */
    volume?: number;
    /** Playback speed from 0.0625 to 16. Defaults to 1. */
    speed?: number;
    /** Preload the audio immediately. */
    preload?: boolean;
    /** Keep the audio element alive between plays. If true, you must call delete() to free it. Defaults to false. */
    persistent?: boolean;
    /** Called each time the audio finishes playing. */
    onEnded?: AudioCallback;
    /** Called when playback hits an error. */
    onError?: AudioErrorHandler;
}

// Wrap the player to allow reprocessing the audio when properties are changed and to alleviate
// the confusion between the public API accepting 0-100 volume while the internal API uses 0-1 volume.
class AudioPlayerWrapper implements AudioPlayerInterface {
    private internalPlayer: AudioPlayerInternal;
    constructor(internalPlayer: AudioPlayerInternal) { this.internalPlayer = internalPlayer; }

    get audio(): string { return this.internalPlayer.audio; }
    set audio(value: string) { this.internalPlayer.preprocessDataOriginal.audio = value; this.internalPlayer.processAudio(); }

    get volume(): number { return this.internalPlayer._volume * 100; }
    set volume(value: number) { this.internalPlayer.preprocessDataOriginal.volume = Math.max(0, Math.min(1, value / 100)); this.internalPlayer.processAudio(); }

    get speed(): number { return this.internalPlayer._speed; }
    set speed(value: number) { this.internalPlayer.preprocessDataOriginal.speed = Math.max(0.0625, Math.min(16, value)); this.internalPlayer.processAudio(); }

    get time(): Promise<number> | null { return this.internalPlayer._audio?.then(audio => audio.currentTime) ?? null; }
    set time(value: number) { this.internalPlayer.ensureAudio().then(audio => audio.currentTime = value); }

    get persistent(): boolean { return this.internalPlayer.persistent; }
    set persistent(value: boolean) { this.internalPlayer.persistent = value; }

    get preload(): boolean { return this.internalPlayer.preload; }
    set preload(value: boolean) { this.internalPlayer.preload = value; value && this.internalPlayer.ensureAudio(); }

    get muted(): Promise<boolean> | null { return this.internalPlayer._audio?.then(audio => audio.muted) ?? null; }
    set muted(value: boolean) { this.internalPlayer.ensureAudio().then(audio => audio.muted = value); }

    get paused(): Promise<boolean> | null { return this.internalPlayer._audio?.then(audio => audio.paused) ?? null; }
    set paused(value: boolean) { value ? this.internalPlayer.pause() : this.internalPlayer.play(); }

    get type(): AudioType { return this.internalPlayer.type; }
    get duration(): Promise<number> | null { return this.internalPlayer._audio?.then(audio => audio.duration) ?? null; }

    load(): void { this.internalPlayer.ensureAudio(); }
    loop(): void { this.internalPlayer.loop(); }
    play(): void { this.internalPlayer.play(); }
    pause(): void { this.internalPlayer.pause(); }
    stop(restart?: boolean): void { this.internalPlayer.stop(restart); }
    restart(): void { this.internalPlayer.stop(true); }
    seek(time: number): void { this.internalPlayer.ensureAudio().then(audio => audio.currentTime = time); }
    mute(): void { this.internalPlayer.ensureAudio().then(audio => audio.muted = true); }
    unmute(): void { this.internalPlayer.ensureAudio().then(audio => audio.muted = false); }
    delete(): void { this.internalPlayer.destroyAudio(); }
}

/**
 * Create an audio player.
 * @param audio Discord audio filename, data URI, or CSP-compliant URL.
 * @param options Audio player options.
 * @param options.volume Volume from 0 to 100. Defaults to 100.
 * @param options.speed Playback speed from 0.0625 to 16. Defaults to 1.
 * @param options.preload Preload the audio immediately. If not persistent, this only lasts until the first play.
 * @param options.persistent Keep the audio element alive between plays. If true, call delete() to free it. Defaults to false.
 * @param options.onEnded Called each time the audio finishes playing.
 * @param options.onError Called when playback hits an error.
 * @return The created audio player.
 */
export function createAudioPlayer(
    audio: string,
    options: AudioPlayerOptions = {}
): AudioPlayerInterface {
    const internalPlayer: AudioPlayerInternal = new AudioPlayerConstructor(
        options,
        audio,
        null,
        null,
        "default"
    );

    return new AudioPlayerWrapper(internalPlayer);
}

/**
 * Play an audio immediately and return the player.
 * @param audio Discord audio filename, data URI, or CSP-compliant URL.
 * @param options Audio player options.
 * @param options.volume Volume from 0 to 100. Defaults to 100.
 * @param options.speed Playback speed from 0.0625 to 16. Defaults to 1.
 * @param options.preload Preload the audio immediately. If not persistent, this only lasts until the first play.
 * @param options.persistent Keep the audio element alive between plays. If true, call delete() to free it. Defaults to false.
 * @param options.onEnded Called each time the audio finishes playing.
 * @param options.onError Called when playback hits an error.
 * @return The created audio player.
 */
export function playAudio(audio: string, options: AudioPlayerOptions = {}): AudioPlayerInterface {
    const player = createAudioPlayer(audio, options);
    player.play();
    return player;
}

/**
 * Work out the audio type from its string.
 * @param audio Audio string to check.
 * @returns Detected audio type.
 */
export function identifyAudioType(audio: string): AudioType {
    if (defaultAudioNames().includes(audio)) return AudioType.DISCORD;

    try {
        const url = new URL(audio);
        if (url.protocol === "http:" || url.protocol === "https:") return AudioType.URL;
        if (url.protocol === "data:") return AudioType.DATA;
        if (url.protocol === "blob:") return AudioType.BLOB;
        if (url.protocol === "file:") return AudioType.PATH;
        return AudioType.OTHER;
    } catch {
        return AudioType.OTHER;
    }
}

/**
 * Register an audio processor that runs before playback.
 * @param key Unique key for this processor. Your plugin name is a good choice.
 * @param processor Function that receives audio data and can mutate the audio and volume in place.
 */
export function addAudioProcessor(key: string, processor: AudioProcessor): void {
    audioProcessorFunctions[key] = processor;
}

/**
 * Remove an audio processor by key.
 * @param key Key of the processor to remove.
 */
export function removeAudioProcessor(key: string): void {
    delete audioProcessorFunctions[key];
}

/** All built-in Discord audio filenames. */
export function defaultAudioNames(): string[] {
    defaultSounds ??= (findDefaultSounds.keys() || []).map(key => {
        const match = key.match(/((?:\w|-)+)\.mp3$/);
        return match ? match[1] : null;
    }).filter(Boolean) as string[];

    return defaultSounds;
}
