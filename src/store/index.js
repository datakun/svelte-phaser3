import { writable } from 'svelte/store';

/** @type {number[]} */
let value = [];

export const doubled = writable(value);
