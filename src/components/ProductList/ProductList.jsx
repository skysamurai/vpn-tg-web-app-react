import React, {useCallback, useEffect, useState} from 'react';
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";

const products = [
    {id: '1', title: 'VPN месяц', price: 200, description: 'VPN на месяц с возможностью продления'},
    {id: '2', title: 'VPN год', price: 2000, description: 'VPN на год с возможностью продления'},
    {id: '3', title: 'VPN сервер', price: 10000, description: 'Свой VPN сервер с возможностью подключения пользователей на год с возможностью продления'},
    {id: '4', title: 'ChatGPT', price: 400, description: 'Регистрация ChatGPT на вашу почту'},
]

const getTotalPrice =  (items) => {
    return items.reduce((acc, item) => {
        return acc +=item.price
    }, 0)
}
const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);
    const {tg, queryId} = useTelegram();

    const onSendData = useCallback(() =>{
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems)
            queryId,
        }
        fetch('http://185.140.209.72:8000/web-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    }, [addedItems,])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if (alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems)

        if  (newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)}`
            });


        }

    }
    return (
        <div className={'list'}>
            {products.map(item => (
                <ProductItem
                    product={item}
                    onAdd={onAdd}
                    className={'item'}
                />
            ))}
        </div>
    );
};

export default ProductList;