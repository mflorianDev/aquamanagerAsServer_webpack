"use strict"

import { getStock } from "../api/transferJSON"

/**
 * 
 * @param {Array} list 
 */
export default class Stock {

    constructor() { }

    init() {
        return getStock()
            .then(obj => Object.assign(this, obj))
    }
}