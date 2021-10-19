import { useWeb3React } from '@web3-react/core';
import { getEntryBySlug } from 'base/contentAPI';
import styled, { css, keyframes } from 'styled-components';
import Page from 'templates/Page';
import { useRouter } from 'next/dist/client/router';
import fetch from 'node-fetch';
import { AbortController } from "node-abort-controller";
import Link from 'next/link';
import { breakpoint } from 'styled-components-breakpoint';
import { useEffect, useState, useMemo, useRef, createRef } from 'react';

import { Canvas, useThree, useLoader } from '@react-three/fiber'
import { TextureLoader, LinearFilter, NearestFilter } from "three"
import * as THREE from "three"

import {
    Section,
    WorkDescription
} from './index'

const WorkImage = styled.img`
    visibility: ${props => props.show ? 'visible' : 'hidden'};
    max-width: 100%;
    height: auto;
`
const WorkWrap = styled.div`
    display: grid;
    grid-template-columns: repeat( auto-fit, minmax(400px, 1fr) );
    grid-gap: 12px;
    position: relative;
`
const WorkImages = styled.div`
    position: relative;
    aspect-ratio: 1 / 1;
`

const ThreeRenderer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
`

function Image(props) {
  //const svg = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="777px" height="777px" preserveAspectRatio="xMinYMin meet" viewBox="0 0 777 777"><defs><rect id="bg" width="100%" height="100%" fill="#fff" /><clipPath id="clip"><use xlink:href="#bg"/></clipPath><filter id="f0" width="300%" height="300%" x="-100%" y="-100%"><feGaussianBlur in="SourceGraphic" stdDeviation="129"/></filter><filter id="f1" width="300%" height="300%" x="-100%" y="-100%"><feGaussianBlur in="SourceGraphic" stdDeviation="700"/></filter></defs><rect width="100%" height="100%" fill="#fff" /><g clip-path="url(#clip)"><use xlink:href="#bg"/><circle cx="22%" cy="55%" r="45%" filter="url(#f1)" fill="#ff5714"></circle><circle cx="86%" cy="28%" r="6%" filter="url(#f1)" fill="#6a706e"></circle><circle cx="84%" cy="14%" r="62%" filter="url(#f0)" fill="#ff5714"></circle><circle cx="38%" cy="16%" r="50%" filter="url(#f0)" fill="#ff5714"></circle><circle cx="55%" cy="45%" r="5%" filter="url(#f0)" fill="#0cf574"></circle><circle cx="40%" cy="71%" r="14%" filter="url(#f0)" fill="#6a706e"></circle><circle cx="63%" cy="13%" r="47%" filter="url(#f0)" fill="#ff5714"></circle></g><style>.txt{font: normal 12px monospace;fill: white;}</style><rect width="90" height="30" x="0" y="747" fill="#000" class="box"></rect><text x="12" y="766" class="txt">#02 Â· 5/7</text><text x="103" y="766" class="txt">1633017700</text></svg>`)}`
  const buf = Buffer.from(props.image.src.split(',')[1], 'base64')
  const cleanSVG = `data:image/svg+xml;utf8,${encodeURIComponent(buf.toString('utf8').replace('preserveAspectRatio','width="777" height="777" preserveAspectRatio'))}`
  //console.log({cleanSVG})

  const { viewport } = useThree()
  const { width, height, top, left } = props.image.getBoundingClientRect()
  const parentBounds = props.image.parentNode.parentNode.getBoundingClientRect()
  const offsetLeft = (left - viewport.width / 2 + width / 2) - parentBounds.left;
  const offsetTop = (-top + viewport.height / 2 - height / 2) + parentBounds.top;

  const [image, setImage] = useState(false)
  //if (!image) return null
  const loader = new TextureLoader()
  loader.load(cleanSVG, (img) => {
      img.magFilter = LinearFilter
      setImage(img)
  })
  //const image = useLoader(TextureLoader, overrideSVG)

  return (
      <mesh
          {...props}
          scale={[width,height,1]}
          position={[offsetLeft,offsetTop,0]}
        >
          useMemo(() => <planeBufferGeometry args={[1,1,1,1]} />
          useMemo(() => <meshBasicMaterial map={image} />
    </mesh>
  )
}

//const svg = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWluWU1pbiBtZWV0IiB2aWV3Qm94PSIwIDAgNzc3IDc3NyI+PGRlZnM+PHJlY3QgaWQ9ImJnIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZmIiAvPjxjbGlwUGF0aCBpZD0iY2xpcCI+PHVzZSB4bGluazpocmVmPSIjYmciLz48L2NsaXBQYXRoPjxmaWx0ZXIgaWQ9ImYwIiB3aWR0aD0iMzAwJSIgaGVpZ2h0PSIzMDAlIiB4PSItMTAwJSIgeT0iLTEwMCUiPjxmZUdhdXNzaWFuQmx1ciBpbj0iU291cmNlR3JhcGhpYyIgc3RkRGV2aWF0aW9uPSI5NyIvPjwvZmlsdGVyPjxmaWx0ZXIgaWQ9ImYxIiB3aWR0aD0iMzAwJSIgaGVpZ2h0PSIzMDAlIiB4PSItMTAwJSIgeT0iLTEwMCUiPjxmZUdhdXNzaWFuQmx1ciBpbj0iU291cmNlR3JhcGhpYyIgc3RkRGV2aWF0aW9uPSI3MDAiLz48L2ZpbHRlcj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2ZmZiIgLz48ZyBjbGlwLXBhdGg9InVybCgjY2xpcCkiPjx1c2UgeGxpbms6aHJlZj0iI2JnIi8+PGNpcmNsZSBjeD0iNzUlIiBjeT0iNDIlIiByPSI0OCUiIGZpbHRlcj0idXJsKCNmMSkiIGZpbGw9IiNmOWI0ZWQiPjwvY2lyY2xlPjxjaXJjbGUgY3g9Ijc4JSIgY3k9Ijc5JSIgcj0iNTUlIiBmaWx0ZXI9InVybCgjZjEpIiBmaWxsPSIjMGNmNTc0Ij48L2NpcmNsZT48Y2lyY2xlIGN4PSI2MyUiIGN5PSIyOSUiIHI9IjUwJSIgZmlsdGVyPSJ1cmwoI2YwKSIgZmlsbD0iIzZhNzA2ZSI+PC9jaXJjbGU+PGNpcmNsZSBjeD0iNjglIiBjeT0iNjclIiByPSI0OCUiIGZpbHRlcj0idXJsKCNmMCkiIGZpbGw9IiMwY2Y1NzQiPjwvY2lyY2xlPjxjaXJjbGUgY3g9Ijc0JSIgY3k9IjE0JSIgcj0iOCUiIGZpbHRlcj0idXJsKCNmMCkiIGZpbGw9IiM2YTcwNmUiPjwvY2lyY2xlPjxjaXJjbGUgY3g9IjE4JSIgY3k9IjYxJSIgcj0iNyUiIGZpbHRlcj0idXJsKCNmMCkiIGZpbGw9IiMwY2Y1NzQiPjwvY2lyY2xlPjxjaXJjbGUgY3g9IjQyJSIgY3k9IjUwJSIgcj0iNTglIiBmaWx0ZXI9InVybCgjZjApIiBmaWxsPSIjMTcwMzEyIj48L2NpcmNsZT48Y2lyY2xlIGN4PSI4MSUiIGN5PSIzMSUiIHI9IjExJSIgZmlsdGVyPSJ1cmwoI2YwKSIgZmlsbD0iI2Y5YjRlZCI+PC9jaXJjbGU+PGNpcmNsZSBjeD0iNDQlIiBjeT0iMjQlIiByPSI0MCUiIGZpbHRlcj0idXJsKCNmMCkiIGZpbGw9IiNmZjU3MTQiPjwvY2lyY2xlPjwvZz48c3R5bGU+LnR4dHtmb250OiBub3JtYWwgMTJweCBtb25vc3BhY2U7ZmlsbDogd2hpdGU7fTwvc3R5bGU+PHJlY3Qgd2lkdGg9IjkwIiBoZWlnaHQ9IjMwIiB4PSIwIiB5PSI3NDciIGZpbGw9IiMwMDAiIGNsYXNzPSJib3giPjwvcmVjdD48dGV4dCB4PSIxMiIgeT0iNzY2IiBjbGFzcz0idHh0Ij4jMDEgwrcgNy83PC90ZXh0Pjx0ZXh0IHg9IjEwMyIgeT0iNzY2IiBjbGFzcz0idHh0Ij4xNjMzMTU0Mzc5PC90ZXh0Pjwvc3ZnPg==`
//const buf = Buffer.from(svg.split(',')[1], 'base64')
//const overrideSVG = `data:image/svg+xml;utf8,${encodeURIComponent(buf.toString('utf8').replace('preserveAspectRatio','width="777" height="777" preserveAspectRatio'))}`

export default function SeventySevenBySeven(props){
    const WORK_COUNT = 7
    const [iteration, setIteration] = useState(1);
    const [works, setWorks] = useState([]);
    const [meshImages, setMeshImages] = useState([]);
    const imageRefs = useRef([]);

    useEffect(() => {
        setMeshImages(imageRefs.current)
    }, [imageRefs.current])

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

    return (<>
        <Page>
            <Section dangerouslySetInnerHTML={{__html: props.content}}/>
                <p>LOADED {works.length}/{WORK_COUNT}</p>
                <WorkWrap>
                    <ThreeRenderer>
                        <Canvas antialias={true} pixelDeviceRatio={2} colorManagement={true} orthographic frameloop="demand">
                            {meshImages.map((image) => {
                                return image && <Image image={image} />
                                // useMemo(() => <Image image={elRefs[i].current} />, [])
                                }
                            )}
                        </Canvas>
                    </ThreeRenderer>
                    {works &&
                        [...Array(WORK_COUNT).keys()].map(i => {
                            const work = works[i]
                            return (
                                <WorkImages placeHolder={true}>
                                    {work &&
                                        <WorkImage
                                            ref={(el) => imageRefs.current.indexOf(el) < 0 && imageRefs.current.push(el)}
                                            show={!meshImages[i]}
                                            key={i}
                                            src={work.iterations[0]}
                                        />
                                    }
                                    {!work && 
                                        <p>LOAD#{i+1}</p>
                                    }
                                </WorkImages>
                            )

                            /*
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
                            */
                        })
                    }
            </WorkWrap>
        </Page>
    </>
    )
}

export async function getStaticProps(){
    const content = await getEntryBySlug('pages', '77x7');
    return {
        props: {
            ...content
        }
    }
}
