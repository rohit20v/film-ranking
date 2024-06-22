import {Form} from "@remix-run/react";
import {useRef, useState} from "react";

const Star = ({fill, onClick, state}: { fill: string, onClick?:() => void, state: string }) => {
    return <>
        <svg
            height="54px"
            width="54px"
            viewBox="-10 -10 67.94 67.94"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            onClick={onClick}
            style={{cursor : state}}
        >
            <path
                fill={fill}
                stroke={'yellow'}
                strokeWidth={2}
                d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757
      c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042
      c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685
      c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528
      c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956
      C22.602,0.567,25.338,0.567,26.285,2.486z"
            />
        </svg>
    </>
};


export const OnlyStar = ({star, handleClick}: { star: number, handleClick?: (newRating: number) => Promise<void> }) => {
    const stars = [];
    for (let i = 0; i < 5; ++i) {
        stars.push(
            <Star
                key={i}
                fill={i < star ? 'yellow' : 'rgba(17,238,17,0)'}
                onClick={() => handleClick?.(i + 1)}
                state={handleClick? "pointer" : "default" }
            />
        );
    }
    return stars;
}

const Rating = ({movieId, rating}: { movieId: number, rating: number }) => {
    const [star, setStar] = useState(rating);
    const formRef = useRef(null);
    const handleClick = async (newRating: number) => {
        setStar(newRating);

        const formData = new FormData();
        formData.append('formType', 'updateRating');
        formData.append('movieId', movieId.toString());
        formData.append('newRating', newRating.toString());

        try {
            await fetch('/films', {
                method: 'POST',
                body: formData,
            });
        } catch (error) {
            console.error('Error updating rating:', error);
        }
    };


    return (
        <div>
            <Form method="post" ref={formRef}>
                <input type="hidden" name="formType" value="updateRating"/>
                <input type="hidden" name="movieId" value={movieId}/>
                <input type="hidden" name="newRating" value={star}/>
                <OnlyStar star={star} handleClick={handleClick}/>
            </Form>
        </div>
    );
}
export default Rating;
