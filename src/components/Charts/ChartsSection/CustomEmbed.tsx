import useElementInView from "@/hooks/useElementInView";
import useIsPhone from "@/hooks/useIsPhone";
import useResizeReload from "@/hooks/useResizeReload";
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import ChartLoader from "./ChartLoader";



export default function CustomEmbed({ src, className }: any) {
  const isPhone = useIsPhone();
  const isMacOS = navigator.userAgent.includes("Macintosh");

  const paramsSearch = new URLSearchParams(window.location.search);
  const isTestIframe = paramsSearch.get('isTestIframe');

  return !isPhone && !isMacOS ? (
    <CustomEmbedWeb_v2
      src={src}
      className={className}
    />
  ) : (
    <CustomEmbedMobile
      src={src}
      className={className}
    />
  );


}


function CustomEmbedWeb_v1({ src, className }: any) {
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef<any>(null);
  const embedKey = useResizeReload();
  const [height, setHeight] = useState(undefined);
  const [width, setWidth] = useState(undefined);


  const handleLoad = () => {
    setIsLoading(false);

    if (height === undefined) {
      setHeight(ref.current.clientHeight);
    }
    if (width === undefined) {
      setWidth(ref.current.clientWidth);
    }


    // setTimeout(() => {
    //   setIsLoading(false);
    // }, 20);

  };
  // useEffect(() => {
  //   if (selectedCompany){
  //     setHeight(undefined)
  //     setWidth(undefined);
  //   }
  // }, [selectedCompany])


  useEffect(() => {
    if (src) setIsLoading(true);
  }, [src]);

  return (
    <React.Fragment>

      {isLoading && (
        <ChartLoader />
      )}
      <embed
        key={embedKey}
        src={src}
        ref={ref}
        onLoad={handleLoad}
        className={className}
        style={{
          minHeight: isLoading ? height : undefined,
          // width: width ?? '100%',
        }}
      />

    </React.Fragment>
  );
}

function CustomEmbedWeb_v2({ src, className }: any) {
  const [isLoading, setIsLoading] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const [height, setHeight] = useState(undefined);
  const [width, setWidth] = useState(undefined);
  const ref = useRef(null);
  const refIframe = useRef<any>(null);
  const embedKey = useResizeReload();

  // Lazy loading with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the iframe is visible
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoading(false);

    if (height === undefined && refIframe.current) {
      setHeight(refIframe.current.clientHeight);
    }
    if (width === undefined && refIframe.current) {
      setWidth(refIframe.current.clientWidth);
    }
  };

  // Set loading state when src changes
  useEffect(() => {
    if (src) setIsLoading(true);
  }, [src]);

  return (
    <div ref={ref} style={{minHeight: '290px'}}>
      {isLoading && <ChartLoader />}
      {isInView && (
        <embed
          key={embedKey}
          src={src}
          ref={refIframe}
          onLoad={handleLoad}
          className={className}
          style={{
            minHeight: isLoading ? height : undefined,
            // width: width ?? '100%',
          }}
        />
      )}
    </div>
  );
}



function CustomEmbedMobile({ src, className }: any) {
  const [isLoading, setIsLoading] = useState(true);
  const refIframeMainDiv = useRef<any>(null);
  const embedref = useRef<any>(null);
  const embedKey = useResizeReload();
  const [height, setHeight] = useState<any>(undefined);
  const [width, setWidth] = useState(undefined);

  const isVisible = useElementInView(refIframeMainDiv);

  useEffect(() => {
    if (embedref.current) setHeight(embedref.current.clientHeight);
    if (!isVisible) setIsLoading(true)
  }, [isVisible]);

  const handleLoad = () => {
    setIsLoading(false);
    if (height === undefined) {
      setHeight(refIframeMainDiv.current.clientHeight);
    }
    if (width === undefined) {
      setWidth(refIframeMainDiv.current.clientWidth);
    }
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <ChartLoader />
      ) : null}
      <div
        ref={refIframeMainDiv}
        style={{
          height: height || "1px",
          width: "100%",
        }}
      >
        {isVisible && (
          <embed
            key={`${embedKey}${src}`}
            src={src}
            ref={embedref}
            onLoadStart={() => setIsLoading(true)}
            onLoad={handleLoad}
            className={className}
          />
        )}
      </div>
    </React.Fragment>
  );
}
