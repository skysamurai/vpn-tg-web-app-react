import React, {useCallback, useEffect, useState} from 'react';
import './Form.css';
import {useTelegram} from "../../hooks/useTelegram";
const Form = () => {
    const [product, setProduct] = useState('');
    const [comments, setComments] = useState('');
    const [delivery, setDelivery] = useState('phisical');
    const {tg} = useTelegram();

    const onSendData = useCallback(() =>{
        const data = {
            product,
            comments,
            delivery
        }
        tg.sendData(JSON.stringify(data));
    }, [product, comments, delivery])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    useEffect(() => {
        tg.MainButton.setParams({
            text: 'Отправить заявку'
        })
    }, [])

    useEffect(() => {
        if (!product || !comments) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }, [product, comments])

    const onChangeProduct = (e) => {
        setProduct(e.target.value)
    }
    const onChangeComments = (e) => {
        setComments(e.target.value)
    }
    const onChangeDelivery = (e) => {
        setDelivery(e.target.value)
    }
    return (
        <div className={"form"}>
            <h3>Опишите что вам нужно оплатить</h3>
            <input
                className={'input'}
                type="text"
                placeholder={'Товар'}
                value={product}
                onChange={onChangeProduct}
            />
            <input
                className={'input'}
                type="text"
                placeholder={'Описание/ссылка товара'}
                value={comments}
                onChange={onChangeComments}
            />
            <select value={delivery} onChange={onChangeDelivery} className={'select'}>
                <option value={'Off'}>Доставка товара не нужна</option>
                <option value={'On'}>Нужно рассчитать доставку</option>
            </select>
        </div>
    );
};

export default Form;