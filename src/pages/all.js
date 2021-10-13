import { useWeb3React } from '@web3-react/core';
import { getEntryBySlug } from 'base/contentAPI';
import { useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import Page from 'templates/Page';
import { useState} from 'react';
import { useRouter } from 'next/dist/client/router';
import fetch from 'node-fetch';
import { AbortController } from "node-abort-controller";
import { useRef } from 'react';
import Link from 'next/link';
import {breakpoint} from 'styled-components-breakpoint';

import {
    Section,
    WorkImage,
    WorkDescription
} from './index'

const WorkWrap = styled.div`
    display: grid;
    grid-template-columns: repeat( auto-fit, minmax(400px, 1fr) );
    grid-gap: 12px;
`
const WorkImages = styled.div`
    position: relative;
    aspect-ratio: 1 / 1;
`

let navTimeout = false;

export default function SeventySevenBySeven(props){
    const WORK_COUNT = 77
    const [iteration, setIteration] = useState(1);
    const [works, setWorks] = useState([]);

    async function fetchWork(index) {
        try {
            const response = await fetch(`/api/77x7/info/${index}`);
            const json = await response.json();
            setWorks(oldArr => [...oldArr, json])
        }
        catch(e){ console.log(e) }
    }

    useEffect(() => {
        [...Array(WORK_COUNT).keys()].map(index => {
            fetchWork(index+1);
        })
    }, [])

    function iterate() {
        let set = 1;
        if(iteration < 7) set = iteration+1;
        setIteration(set)
    }

    return <Page>
        <Section dangerouslySetInnerHTML={{__html: props.content}}/>
            <p>LOADED {works.length}/{WORK_COUNT}</p>
            <WorkWrap>
                {works &&
                    [...Array(WORK_COUNT).keys()].map(i => {
                        const work = works[i]
                        return (
                            <WorkImages placeHolder={true} onClick={iterate}>
                                {work &&
                                    [...Array(7).keys()].map((index) => 
                                        <WorkImage
                                            show={iteration == index}
                                            key={index}
                                            src={work.iterations[index-1]}
                                        />
                                    )
                                }
                                {!work && 
                                    <p>LOAD#{i+1}</p>
                                }
                            </WorkImages>
                        )
                    })
                }
        </WorkWrap>
    </Page>
}

export async function getStaticProps(){
    const content = await getEntryBySlug('pages', '77x7');
    return {
        props: {
            ...content
        }
    }
}
