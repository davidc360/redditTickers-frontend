import React, { useEffect, useState, useRef } from 'react'
import styles from "./Tickers.module.sass"

import axios from 'axios'

export default function () {
    return (
        <div>
            <TicksFromSub subreddit='wallstreetbets'/>
        </div>
    )
}

function TicksFromSub({ subreddit }) {
    const [data, updateData] = useState()
    const alreadySynced = useRef(false)

    axios.get(`https://redditstocks.herokuapp.com/` + subreddit, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        }})
    .then(res => {
        if (!alreadySynced.current) {
            updateData(res.data)
            alreadySynced.current = true   
        }
    })

    let tickerRows = []
    if (data) {
        console.log(data['tickers'])
        let keys = Object.keys(data.tickers)
        // sort the tickers by mention count
        keys.sort((a, b) => data.tickers[a] - data.tickers[b] )
        
        for (const key of keys) {
            tickerRows.push(
                <TickerRow {...data.tickers[key]} ticker={key}/>
            )
        }
    }
    
    return (
        <div className={styles.ctn}>
            <div>
                <h1 className={styles.subName}>r/{subreddit}</h1>
                <p>{data && data.lastUpdated && 'last updated: ' + data.lastUpdated}</p>
            </div>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th className={styles.left}>Ticker</th>
                    <th>Mentions</th>
                    <th>Positive Strength</th>
                    <th>% positive</th>
                    <th>Negative Strength</th>
                    <th>% Negative</th>
                    <th>% Neutral</th>
                </tr>
                </thead>
                <tbody>{tickerRows}</tbody>
            </table>
        </div>
    )
}

function TickerRow({ ticker, count, pos_sent, pos_sent_cnt, neg_sent, neg_sent_cnt, neut_sent_cnt}) {
    let total_sent_cnt = 0
    if (pos_sent_cnt)
        total_sent_cnt += pos_sent_cnt    
    if (neg_sent_cnt)
        total_sent_cnt += neg_sent_cnt    
    if (neut_sent_cnt)
        total_sent_cnt += neut_sent_cnt    
    const sent_percent = sent_cnt => sent_cnt ? (sent_cnt/total_sent_cnt*100).toFixed(2) + '%' : null
    return (
        <tr>
            <td className={styles.left}>{ticker}</td>
            <td>{count}</td>
            <td>{pos_sent}</td>
            <td>{sent_percent(pos_sent_cnt)}</td>
            <td>{neg_sent}</td>
            <td>{sent_percent(neg_sent_cnt)}</td>
            <td>{sent_percent(neut_sent_cnt)}</td>
        </tr>
    )
}