import { interpolate } from 'flubber';
import React, { memo, useEffect, useRef, useState } from 'react';
import { animated, useSpring } from 'react-spring/web.cjs';

const asUseSpring: any = useSpring;

function _Slice(props: any) {
    const { sliceactive, activepath, path } = props;
    const activePathRef = useRef(activepath);
    const pathRef = useRef(path);
    const reverse = useRef(false);

    const [needAnimate, setNeedAnimate] = useState(false);
    const [interpolator, setInterpolator] = useState({
        func: interpolate(path, activepath, { maxSegmentLength: 3 })
    });

    const [animatedValue, setAnimate] = asUseSpring(() => ({
        to: { x: sliceactive ? 1 : 0 },
        from: { x: 0 },
        config: { duration: 150 }
    }));

    useEffect(() => {
        setAnimate({ to: { x: reverse.current ? (sliceactive ? 0 : 1) : sliceactive ? 1 : 0 } });
    }, [sliceactive]);

    useEffect(() => {
        // handle path changed;
        if (activePathRef.current !== activepath) {
            const nextInterpolator = sliceactive
                ? interpolate(activepath, activePathRef.current, { maxSegmentLength: 3 })
                : interpolate(pathRef.current, path, { maxSegmentLength: 3 });
            setInterpolator({ func: nextInterpolator });
            setNeedAnimate(true);
        }
    }, [activepath]);

    useEffect(() => {
        if (needAnimate) {
            setAnimate({ to: { x: sliceactive ? 0 : 1 } });
            setNeedAnimate(false);

            setTimeout(() => {
                reverse.current = !reverse.current;
                setInterpolator({
                    func: reverse.current
                        ? interpolate(activepath, path, { maxSegmentLength: 3 })
                        : interpolate(path, activepath, { maxSegmentLength: 3 })
                });
            }, 500);
        }
    }, [needAnimate]);

    return (
        <animated.path
            filter={props.filter}
            fill={props.fill}
            style={props.style}
            onClick={props.onClick}
            d={animatedValue.x.interpolate(interpolator.func)}
        />
    );
}

export const Slice = memo(_Slice);
