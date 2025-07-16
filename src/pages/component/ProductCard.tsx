import React from 'react';
import { View, Image, Text } from '@tarojs/components';
import './ProductCard.scss';
import Taro from "@tarojs/taro";

const ProductCard = ({ products }) => {

  const handleItemClick = (product) => {
    Taro.navigateTo({
      url: `/pages/goodsdetail/gooddetail?id=${product.id}&image=${product.image}&title=${product.title}&price=${product.price}&badge=${product.badge}&marketprice=${product.marketprice}&category=${product.category}&descript=${product.descript}`,
    });
  };

  return (
    <View className="product-list">
      {products.map((product) => (
        <View className="product-card" key={product.id} onClick={() => handleItemClick(product)}>
          <View className="product-image-container">
            <Image className="product-image" src={product.image} />
          </View>
          <View className="product-info1">
            <Text className="product-title1">{product.title}</Text>
            <View className="product-price-container1">
              <Text className="product-price1">¥{parseFloat(product.price).toFixed(2)}</Text>
              <Text className="product-badge1">{product.badge}</Text>
            </View>
            <Text className="product-marketprice1">¥{parseFloat(product.marketprice).toFixed(2)}</Text>
            <Text className="product-category1">{product.category}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default ProductCard;
