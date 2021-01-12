import React, { useEffect, useState, useRef } from 'react'
import styles from "./Tickers.module.sass"
import './icons.css'

import axios from 'axios'

const subreddits = [
    'wallstreetbets',
    'stocks',
    'stockmarket',
    'spacs',
    'investing',
    'options',
    'robinhood',
    'stock_picks'
]

export default function () {
    return (
        <div>
            {
                subreddits.map(sub => <TicksFromSub subreddit={sub}/>)
            }
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
        // limit to 20 tickers
        keys = keys.slice(0, 20)
        // sort the tickers by mention count
        keys.sort((a, b) => data.tickers[b].count - data.tickers[a].count )
        
        for (const key of keys) {
            tickerRows.push(
                <TickerRow {...data.tickers[key]} ticker={key} key={key}/>
            )
        }
    }

    const loaded = data ? true : false
    const dataIsEmpty = !data || Object.keys(data.tickers).length == 0    

    const noTickers = (
        <div>Didn't find enough stocks being discussed.</div>
    )
    const tickerTable = (
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
    )
    const main_section = (
        <>
        <div className={styles.title}>
            <h1 className={styles.sub}>r/{subreddit}</h1>
            <div className={styles.lastUpdated}>
                <p>Last updated:</p>
                <p>{data && data['last_updated']}</p>
            </div>
        </div>
        { dataIsEmpty ? noTickers : tickerTable } 
        </>
    )
    const loader = (
        <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
    )

        
    return (
        <div className={styles.ctn}>
            { loaded ? main_section : loader }
        </div>
    )
}

function TickerRow({ ticker, count, pos_sent, pos_sent_cnt=0, neg_sent, neg_sent_cnt=0, neut_sent_cnt=0}) {
    let total_sent_cnt = pos_sent_cnt + neg_sent_cnt + neut_sent_cnt    

    const sent_percent = sent_cnt => sent_cnt ? (sent_cnt/total_sent_cnt*100).toFixed(2) + '%' : null
    return (
        <tr>
            <td className={styles.left}>{ticker}</td>
            <td>{count}</td>
            <td>{pos_sent && (pos_sent*100).toFixed(0)}</td>
            <td>{sent_percent(pos_sent_cnt)}</td>
            <td>{neg_sent && (neg_sent*100).toFixed(0)}</td>
            <td>{sent_percent(neg_sent_cnt)}</td>
            <td>{sent_percent(neut_sent_cnt)}</td>
        </tr>
    )
}