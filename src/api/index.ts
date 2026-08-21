/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import * as $AudioPlayer from "./AudioPlayer";
import * as $Badges from "./Badges";
import * as $ChatButtons from "./ChatButtons";
import * as $Commands from "./Commands";
import * as $ContextMenu from "./ContextMenu";
import * as $DataStore from "./DataStore";
import * as $GifPickerContextMenu from "./GifPickerContextMenu";
import * as $HeaderBar from "./HeaderBar";
import * as $MemberListDecorators from "./MemberListDecorators";
import * as $MessageAccessories from "./MessageAccessories";
import * as $MessageDecorations from "./MessageDecorations";
import * as $MessageEventsAPI from "./MessageEvents";
import * as $MessagePopover from "./MessagePopover";
import * as $MessageUpdater from "./MessageUpdater";
import * as $NicknameIcons from "./NicknameIcons";
import * as $Notices from "./Notices";
import * as $Notifications from "./Notifications";
import * as $UserArea from "./UserArea";
export * as PluginManager from "./PluginManager";
import * as $ProfileCollections from "./ProfileCollections";
import * as $ProfileSections from "./ProfileSections";
import * as $ServerList from "./ServerList";
import * as $Settings from "./Settings";
import * as $Styles from "./Styles";
import * as $SurfaceClasses from "./SurfaceClasses";
import * as $Themes from "./Themes";
import * as $UserSettings from "./UserSettings";

/**
 * Listen for message clicks or run your own logic before a message is sent.
 *
 * If your plugin uses this, add MessageEventsAPI to its dependencies.
 */
export const MessageEvents = $MessageEventsAPI;

/**
 * Show custom notices (top snackbars, like the Update prompt).
 */
export const Notices = $Notices;

/**
 * Register custom commands.
 */
export const Commands = $Commands;

/**
 * IndexedDB-backed key-value storage. Supports large data and many types
 * (Blob, Map, ...); see the MDN link for the full list.
 *
 * Prefer this over the Settings API when possible — localStorage has tight
 * size limits and blocks the event loop.
 *
 * Keep keys unique (prefix them with your plugin name) and delete old entries
 * you no longer need. This is just idb-keyval under the hood.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#supported_types}
 */
export const DataStore = $DataStore;

/**
 * Add custom components as message accessories.
 */
export const MessageAccessories = $MessageAccessories;

/**
 * Add custom buttons to the message popover.
 */
export const MessagePopover = $MessagePopover;

/**
 * Add badges to user profiles.
 */
export const Badges = $Badges;

/**
 * Add custom elements to the server list.
 */
export const ServerList = $ServerList;

/**
 * Attach semantic data attributes and limited props to stable Discord layout
 * surfaces without directly patching them.
 */
export const SurfaceClasses = $SurfaceClasses;

/**
 * Add components as message decorations.
 */
export const MessageDecorations = $MessageDecorations;

/**
 * Add decorators to member list users, in DMs and servers.
 */
export const MemberListDecorators = $MemberListDecorators;

/**
 * Persist plugin settings.
 */
export const Settings = $Settings;

/**
 * Load and unload styles dynamically.
 */
export const Styles = $Styles;

/**
 * Display notifications.
 */
export const Notifications = $Notifications;

/**
 * Patch context menus and add/remove items.
 */
export const ContextMenu = $ContextMenu;

/**
 * Add buttons to the chat input.
 */
export const ChatButtons = $ChatButtons;

/**
 * Add buttons to the header bar or channel toolbar.
 */
export const HeaderBar = $HeaderBar;

/**
 * Update and re-render messages.
 */
export const MessageUpdater = $MessageUpdater;

/**
 * Read a Discord user setting.
 */
export const UserSettings = $UserSettings;

/**
 * Internal — not for use in plugins.
 */
export const Themes = $Themes;

/**
 * Add icons next to nicknames in profiles.
 */
export const NicknameIcons = $NicknameIcons;

/**
 * Play internal Discord audio files or external audio URLs/URIs.
 */
export const AudioPlayer = $AudioPlayer;

/**
 * Add buttons to the user area panel.
 */
export const UserArea = $UserArea;

/**
 * Set to true in Retribution to distinguish it from Vencord.
 */
export const isRetribution = true;

/**
 * Add extra collections alongside Discord's game collection.
 */
export const ProfileCollections = $ProfileCollections;

/**
 * Add sections near the "Member Since" area of user profiles.
 */
export const ProfileSections = $ProfileSections;

/**
 * Add items to the GIF picker right-click context menu without conflicting
 * with other plugins.
 */
export const GifPickerContextMenu = $GifPickerContextMenu;
