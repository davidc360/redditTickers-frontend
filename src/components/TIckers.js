import React, { useEffect, useState, useRef } from 'react'
import styles from "./Tickers.module.sass"

export default function () {
    return (
        <div>
            <TicksFromSub subreddit='wallstreetbets'/>
        </div>
    )
}

function TicksFromSub ({subreddit}) {
    return (
        <div className={styles.ctn}>
            <h1 className={styles.subName}>{subreddit}</h1>
            <table className={styles.table}>
                <tr>
                    <th className={styles.left}>Ticker</th>
                    <th>Mentions</th>
                    <th>Positive Strength</th>
                    <th>% positive</th>
                    <th>Negative Strength</th>
                    <th>% Negative</th>
                    <th>% Neutral</th>
                </tr>
                <TickerRow name='hello' count={5}/>
            </table>
        </div>
    )
}

function TickerRow({ name, count, positive_strength, positive_count, negative_strength, negative_count, neutral_count}) {
    return (
        <tr>
            <td className={styles.left}>{name}</td>
            <td>{count}</td>
            <td>{positive_strength}</td>
            <td>{positive_count}</td>
            <td>{negative_strength}</td>
            <td>{negative_count}</td>
            <td>{neutral_count}</td>
        </tr>
    )
}