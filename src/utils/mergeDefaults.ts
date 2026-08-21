/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/**
 * Recursively merges defaults into an object and returns the same object
 * @param obj Object
 * @param defaults Defaults
 * @returns obj
 */
const FORBIDDEN_KEYS = new Set(["__proto__", "constructor", "prototype"]);

export function mergeDefaults<T>(obj: T, defaults: T): T {
    for (const key of Object.keys(defaults as any)) {
        if (FORBIDDEN_KEYS.has(key)) continue;
        const v = (defaults as any)[key];
        if (typeof v === "object" && !Array.isArray(v)) {
            (obj as any)[key] ??= {} as any;
            mergeDefaults((obj as any)[key], v);
        } else {
            (obj as any)[key] ??= v;
        }
    }
    return obj;
}
