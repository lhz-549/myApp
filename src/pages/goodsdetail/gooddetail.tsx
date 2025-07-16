import Taro, {useRouter} from '@tarojs/taro';
import {View, Text, Image, Button, ScrollView} from '@tarojs/components';
import './gooddetail.scss';
import React, {useEffect, useState} from "react";
import ProductCard from "../component/ProductCard";
import {AtButton, AtFloatLayout} from "taro-ui";
import 'taro-ui/dist/style/components/float-layout.scss';
import request from "../../utils/request";

const ProductDetail = () => {
  const router = useRouter();
  const { id, image, title, price, badge, marketprice, category, descript,specvalueId,specvalueName} = router.params;

  useEffect(() => {
    if (title) {
      Taro.setNavigationBarTitle({
        title: title
      });
    }
  }, [title]);

  const [ products, setProducts] = useState([
    {
      id: 1,
      title: 'YH 樱花',
      price: '2199',
      marketprice: '2399',
      badge: '赠',
      category: '科目: 乔木',
      image: 'https://i.111666.best/image/c7aJzF1fD7Q84qiUiYGwbX.png',
    },
  ]);

  const [prospecs,setProspecs]=useState([
    {
      name: '高度',value: ['0.5 m','1.0 m','1.5 m','2.0 m',]
    },
    {
      name: '树龄',value: ['1 n','2 n','3 n',]
    },
    {
      name: '花色',value: ['白色','粉色']
    },
  ]);

  const imagesdetail = [
    "https://i.111666.best/image/7mQRYdijANF4GDswyz93Gc.jpg",
    "https://i.111666.best/image/NTeDiKoVVicGjjcITxK2s5.jpg",
    "https://i.111666.best/image/lcPLLhoqoT9hXh4iCt0A9i.jpg",
    "https://i.111666.best/image/AMbt7ikOvaoezNACQn4xwd.jpg",
    "https://i.111666.best/image/c6tuATeZ62B40SpQRzZP0K.jpg",
    "https://i.111666.best/image/qzF3mHTjTOI0K0Lj2ydvq9.jpg",
    "https://i.111666.best/image/pP428xZJy3z0gI25T1uYNk.jpg",
  ];

  const [isOpened, setIsOpened] = useState(false);
  const [isshow, setIsshow] = useState(false);
  const [isbuy, setIsbuy] = useState(false);
  const handleOpen = () => {
    setIsOpened(true);
    setIsshow(true);
  };
  const handleOpen2 = () => {
    setIsOpened(true);
    setIsbuy(true);
  };
  const handleOpen3 = () => {
    setIsOpened(true);
    setIsshow(true);
    setIsbuy(true);
  };
  const handleClose = () => {
    setIsOpened(false);
    setIsshow(false);
    setIsbuy(false);
  };

  const [quantity, setQuantity] = useState(1);
  const handleQuantityChange = (value) => {
    if (value > 0) {
      setQuantity(value);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const nowbuy=(id, image, title, proprice, quantity, selectspecshow2, selectspecshow)=>{
    Taro.navigateTo({
      url: `/pages/confirmorder/confirmorder?id=${id}&image=${image}&title=${title}&price=${proprice}&quantity=${quantity}&specvalueId=${selectspecshow2}&specvalueName=${selectspecshow}`,
    });
  };

  const handleConfirm = () => {
    const userInfo = Taro.getStorageSync('userInfo');
    const userid = userInfo.id;
    console.log("userid:"+userid);
    if(userid === null || userid === undefined || userid === ''){
      Taro.showToast({
        title: '请先登录账号',
        icon: 'none',
      });
    }else{
      request({
        url: `/cartitems/addprotocartlistnew?userid=${userid}&pid=${id}
        &quantity=${quantity}&svid=${selectspecshow2}&svname=${selectspecshow}`,
        method: 'POST',
        header: {
          //'token': `Bearer ${Taro.getStorageSync('token')}`,
          'Content-Type': 'application/json',
        }
      }).then(res => {
        if (res.message === "success") {
          Taro.eventCenter.trigger('cartUpdated');
          Taro.showToast({
            title: '成功加入购物车',
            icon: 'success',
          });
        } else {
          Taro.showToast({
            title: '加入购物车失败',
            icon: 'none',
          });
        }
      });
    }
    handleClose();
  };

  useEffect(() => {
    request({
      url: `/products/allprolistandtype2?id=${id}`,
      method: 'POST',
      header: {
        //'token': `Bearer ${Taro.getStorageSync('token')}`,
        'Content-Type': 'application/json',
      }
    }).then(res => {
      if (res.message === "success") {
        const proItems = res.data.map(item => ({
          id: item.id,
          title: item.pname,
          price: item.pprice,
          marketprice: item.pmarketprice,
          badge: item.badge,
          category: '科目: '+item.categoryName,
          quantity: item.stockQuantity,
          image: item.pimage,
          descript: item.pdescription,
        }));
        //console.log(proItems);
        setProducts(proItems);
      } else {
        Taro.showToast({
          title: '获取商品列表失败',
          icon: 'none',
        });
      }
    }).catch(err => {
      Taro.showToast({
        title: '请求失败: ' + err.message,
        icon: 'none',
      });
    });
  }, []);


  const [selectedSpecs, setSelectedSpecs] = useState({});
  const selectspecvalue = (specIndex, valueIndex) => {
    console.log(`Selected spec: ${prospecs[specIndex].name}, value: ${prospecs[specIndex].value[valueIndex].value}`);
    setSelectedSpecs(prevProspecs => ({
      ...prevProspecs,
      [specIndex]: valueIndex
    }));
  };
  useEffect(() => {
    console.log(selectedSpecs);
    if (Object.keys(selectedSpecs).length === prospecs.length) {
        const totalPrice = Object.keys(selectedSpecs).reduce((total, specIndex) => {
        const valueIndex = selectedSpecs[specIndex];
        return total + prospecs[specIndex].value[valueIndex].specPrice;
      }, 0);
      setProprice(parseFloat(totalPrice) + parseFloat(price));
    }
    //刷新选择规格的已选显示
    const select2 = Object.keys(selectedSpecs).map(one => ({
      first: one,
      second: selectedSpecs[one]
    }));
    const specString = select2.map(selvalue => {
      const specIndex = selvalue.first;
      const valueIndex = selvalue.second;
      return `${prospecs[specIndex].name}:${prospecs[specIndex].value[valueIndex].value}`;
    }).join(', ');
    setSelectspecshow(specString);
    console.log(specString);

    const specString2 = select2.map(selvalue => {
      const specIndex = selvalue.first;
      const valueIndex = selvalue.second;
      return `${prospecs[specIndex].value[valueIndex].selspecid}`;
    }).join(',');
    setSelectspecshow2(specString2);
    console.log(specString2);

  }, [selectedSpecs, prospecs]);

  const [selectspecshow,setSelectspecshow]=useState("");
  const [selectspecshow2,setSelectspecshow2]=useState("");

  useEffect(()=>{
    request({
      url: `/product-spec-values/selectSpecvalueBypid?pid=${id}`,
      method: 'POST',
      header: {
        //'token': `Bearer ${Taro.getStorageSync('token')}`,
        'Content-Type': 'application/json',
      }
    }).then(res => {
      if (res.message === "success") {
        const groupedSpecs = res.data.reduce((acc, item) => {
          if (!acc[item.specName]) {
            acc[item.specName] = [];
          }
          acc[item.specName].push({ value: item.specValue, specPrice: item.specPrice, selspecid: item.id});
          return acc;
        }, {});

        const formattedSpecs = Object.keys(groupedSpecs).map(specName => ({
          name: specName,
          value: groupedSpecs[specName]
        }));

        setProspecs(formattedSpecs);
        console.log("formattedSpecs"+formattedSpecs);

        const initialSelectedSpecs = {};
        formattedSpecs.forEach((spec, index) => {
          initialSelectedSpecs[index] = 0;
        });

        // 如果 specvalueId 不为空，则初始化 selectedSpecs
        if (specvalueId) {
          res.data.forEach((item, itemIndex) => {
            if (specvalueId.includes(item.id)) {
              const specIndex = formattedSpecs.findIndex(spec => spec.name === item.specName);
              if (specIndex > -1) {
                const valueIndex = formattedSpecs[specIndex].value.findIndex(value => value.selspecid === item.id);
                if (valueIndex > -1) {
                  initialSelectedSpecs[specIndex] = valueIndex;
                }
              }
            }
          });
        }

        setSelectedSpecs(initialSelectedSpecs);
      }
    }).catch(err => {
      Taro.showToast({
        title: '网络请求失败',
        icon: 'none',
      });
    });
  },[]);

  const [proprice,setProprice]=useState(0);

  const scrollStyle = {
    height: '300px',
  };

  useEffect(()=>{
    request({
      url: `/products/allprolistandtypebyid?id=${id}`,
      method: 'POST',
      header: {
        //'token': `Bearer ${Taro.getStorageSync('token')}`,
        'Content-Type': 'application/json',
      }
    }).then(res => {
      if (res.message === "success") {
        const proItem = res.data.map(item => ({
          id: item.id,
          title: item.pname,
          price: item.pprice,
          marketprice: item.pmarketprice,
          badge: item.badge,
          stockQuantity:item.stockQuantity,
          selledQuantity:item.selled_quantity,
          category: '科目: '+item.categoryName,
          quantity: item.stockQuantity,
          image: item.pimage,
          descript: item.pdescription,
        }));
        // badge, marketprice, category, descript,specvalueId,specvalueName
        const newpro={
          badge: proItem[0].badge,
          marketprice: proItem[0].marketprice,
          category: proItem[0].category,
          descript: proItem[0].descript,
          stockQuantity: proItem[0].stockQuantity,
          selledQuantity: proItem[0].selledQuantity
        };
        setPro(newpro);
      }}).catch(err => {
      Taro.showToast({
        title: '请求失败: ' + err.message,
        icon: 'none',
      });
    });
  },[])
  const [pro, setPro] = useState({});



  return (
    <View className="product-detail">
      <View>
        {/* 顶部图片 */}
        <Image className="main-image" src={image} />
      </View>

      {/* 商品信息 */}
      <View className="product-info">
        <Text className="product-title">
          {title}
          <Text className="product-category">
            {pro.category}
            {/*{category}*/}
          </Text>
        </Text>
        <Text className="product-price">
          {proprice.toFixed(2)}
          {/*{price}*/}
          <Text className="product-marketprice">
            {/*{marketprice}*/}
            {parseFloat(pro.marketprice).toFixed(2)}
          </Text>
          <Text className="product-badge">
            {/*{badge}*/}
            {pro.badge}
          </Text>
        </Text>

        <View className="actions">
          {/*<View className="action-button-icon">*/}
          {/*  <Image src="path/to/service-icon.png" className="icon" />*/}
          {/*  <Text className="icon-text">客服</Text>*/}
          {/*</View>*/}
          <View className="action-button-icon" onClick={() => {
            Taro.navigateTo({
              //Taro.redirectTo({
              // Taro.switchTab({
              url: '/pages/shopcar2/shopcar2',
            });
          }}>
            <Image src="../../assets/icons/cart-outline.png" className="icon" />
            <Text className="icon-text">购物车</Text>
          </View>
          <Button className="action-button action-button-car" onClick={handleOpen}>加入购物车</Button>
          {/*<Button className="action-button action-button-buy"*/}
          {/*        onClick={()=>nowbuy(id, image, title, proprice, quantity, selectspecshow2, selectspecshow)}*/}
          {/*>立即购买</Button>*/}
          <Button className="action-button action-button-buy" onClick={handleOpen2}>立即购买</Button>
        </View>
      </View>


      {/*规格*/}
      <View className="pro-spec-out2" onClick={handleOpen3}>
        <Text className="selected-befor">已选</Text>
        <Text className="selected-befor2">{selectspecshow}</Text>
        <View className="spacer"></View>
        <View className="selected-befor3-view">
          <Text className="selected-befor3"> x {quantity}</Text>
        </View>
      </View>


      {/* 商品详情 */}
      <View className="product-description">
        <Text className="section-title">商品详情</Text>
        {/*<Text className="description-text">这里是商品的详细描述...</Text>*/}
        <View className="photo-list2">
          <Text className="pro-detail">
            {/*{descript}*/}
            {pro.descript}
          </Text>
          {imagesdetail.map((image, index) => (
            <Image
              key={index}
              className="photo-item2"
              src={image}
              mode="widthFix"
            />
          ))}
        </View>
      </View>

      {/* 基地实拍 */}
      <View className="base-photos">
        <Text className="section-title3">基地实拍</Text>
        <View className="photo-list">
          <Image className="photo-item" src="https://i.111666.best/image/btrNO5jHpimiDAOt0SbYId.jpg" />
          <Image className="photo-item" src="https://i.111666.best/image/NfkXUDgXh5UPEfaCdZFQG3.jpg" />
        </View>
      </View>

      {/* 推荐商品 */}
      <View>
        <View className="recommended-products">
          <Text className="section-title2">推荐商品</Text>
          <ProductCard  products={products} />
        </View>
        <Text className="bottomline">我也是有底限的</Text>
      </View>

      {/* AtFloatLayout */}
      <AtFloatLayout isOpened={isOpened} title="加入购物车" onClose={handleClose} className="outFloat">
        <View className="product-detail2">
          <View className="product-header2">
            <Image className="product-image2" src={image} />
            <View className="product-info2">
              <Text className="product-price2">¥
                {/*{price}*/}
                {proprice.toFixed(2)}
              </Text>
              <Text className="product-title2">{title}</Text>
            </View>
          </View>
          <ScrollView  scrollY="true" style={scrollStyle}>

            <View className="pro-spec-out">
              <Text className="selected-befor">已选</Text>
              <View className="pro-spec">
                {prospecs.map((specone, specIndex) => (
                  //规格值
                  <View className="pro-spec" key={specIndex}>
                    <Text className="spec-name" >{specone.name}</Text>
                    <View className="pro-spec-value">
                      {specone.value && specone.value.map((onevalue,valueIndex)=>(
                        <Text
                          className={selectedSpecs[specIndex] === valueIndex ? 'spec-value-select' : 'spec-value'}
                          key={valueIndex}
                          onClick={()=>selectspecvalue(specIndex,valueIndex)}
                        >{onevalue.value}</Text>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View className="section2">
              <Text className="section2-title">购买数量</Text>
              <View className="quantity-selector2">
                <View className="quantity-button2" onClick={() => handleQuantityChange(quantity - 1)}>-</View>
                <Text className="quantity-value2">{quantity}</Text>
                <View className="quantity-button2" onClick={() => handleQuantityChange(quantity + 1)}>+</View>
              </View>
            </View>
          </ScrollView>
          <View className="actions2">
            {/*<AtButton className="action2-button-car" onClick={()=>handleConfirm()}>加入购物车</AtButton>*/}
            {/*<AtButton className="action2-button-buy" onClick={()=>nowbuy(id, image, title, proprice, quantity, selectspecshow2, selectspecshow)}*/}
            {/*>立即购买</AtButton>*/}
            {isshow && <AtButton className="action2-button-car" onClick={()=>handleConfirm()}>加入购物车</AtButton>}
            {isbuy && <AtButton className="action2-button-buy" onClick={()=>nowbuy(id, image, title, proprice, quantity, selectspecshow2, selectspecshow)}
            >立即购买</AtButton>}
          </View>
        </View>
      </AtFloatLayout>
    </View>
  );

}

export default ProductDetail;
