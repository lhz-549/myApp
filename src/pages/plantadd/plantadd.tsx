import React, {useEffect, useState} from 'react';
import {View, Picker, Text,Image} from '@tarojs/components';
import './plantadd.scss';
import {AtButton, AtList, AtListItem, AtInputNumber} from "taro-ui";
import Taro, {useRouter} from "@tarojs/taro";
import "taro-ui/dist/style/components/list.scss";
import "taro-ui/dist/style/components/button.scss";
import request from "../../utils/request";
import "taro-ui/dist/style/components/input-number.scss";
import "taro-ui/dist/style/components/icon.scss";

const plantadd = () => {

  const [choose,setChoose]=useState("");
  const [sleoid,setSleoid]=useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSubmit = () => {
    if (choose&&sleoid&&selectedItem) {
      console.log(sleoid,quantityvalue);
      request({
        url: `/plant/addplantbyorderid?orderid=${sleoid}&quantity=${quantityvalue}`,
        method: 'POST',
        header: {
          //'token': `Bearer ${Taro.getStorageSync('token')}`,
          'Content-Type': 'application/json',
        }
      }).then(res => {
        if (res.message === "success") {
          Taro.eventCenter.trigger('plantUpdated');
          Taro.showToast({
            title: '已提交您的种植申请！',
            icon: 'success'
          });
          setTimeout(() => {
            // Taro.navigateBack();
            Taro.switchTab({
              url:'/pages/plant/index',
            });
          }, 1000);

        }}).catch(err => {
          Taro.showToast({
            title: '网络请求失败' ,
            icon: 'none',
          });
        });
    } else {
      Taro.showToast({
        title: '请填写完所有信息后再重新提交！',
        icon: 'none'
      });
    }
  };
  const handleReset=()=> {
    setChoose('');
    setSleoid('');
    setSelectedItem(null);
    setMaxnum(0);
    setQuantityvalue(1);
  }
  const handleTimePeriodChange = (e) => {
    const selected = canchoseplantlist[e.detail.value];
    setChoose(selected.pname + ' ' + selected.specvalueName);
    setSleoid(selected.orderitemId);
    setSelectedItem(selected); // 保存选中的项的详细信息
    setMaxnum(parseInt(selected.usedNum));
  };

  const [canchoseplantlist,setCanchoseplantlist]=useState([
    {

    },
  ]);
  const userInfo = Taro.getStorageSync('userInfo');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(()=>{
    if(userInfo){
      request({
        url: `/orderitems/findusedplant?userid=${userInfo.id}`,
        method: 'POST',
        header: {
          //'token': `Bearer ${Taro.getStorageSync('token')}`,
          'Content-Type': 'application/json',
        }
      }).then(res => {
        if (res.message === "success") {
          const proItem2 = res.data.map(item => ({
            orderitemId: item.orderitemId,
            orderNum: item.orderNum,
            usedNum: item.usedNum,
            quantity: item.quantity,
            specvalueName: item.specvalueName,
            pname: item.pname,
            pimage: item.pimage
          }));
          //console.log(proItem2);
          setCanchoseplantlist(proItem2);
        }}).catch(err => {
        Taro.showToast({
          title: '登录请求失败: ' + err.message,
          icon: 'none',
        });
      });
    }
  },[])

  const [quantityvalue,setQuantityvalue]=useState(1);
  const [maxnum,setMaxnum]=useState(0);
  const handleChange = (value) => {
    setQuantityvalue(value);
  };

  return (
    <View className="outside">
      <View className="titletop">
        <Text>YG—新增种植单</Text>
      </View>
      <View className="totalout">
        <View className="yuyuebj">
          <Picker mode="selector"
                  range={canchoseplantlist.map(item => item.pname + ' ' + item.specvalueName)}
                  onChange={handleTimePeriodChange}
          >
            <AtList>
              <AtListItem
                title='请选择果树'
                extraText={choose || '请选择果树'}
              />
            </AtList>
          </Picker>
        </View>
      </View>
      {choose&&sleoid&&selectedItem&&
        <View className="orderinfocol">
          <Text className="infotextdetail">订单编号 : <Text className="infodata">{selectedItem.orderNum}</Text></Text>
          <Text className="infotextdetail">可用数量 : <Text className="infodata">{selectedItem.usedNum}</Text></Text>
          <Text className="infotextdetail">订单数量 : <Text className="infodata">{selectedItem.quantity}</Text></Text>
          <Text className="infotextdetail">规格名称 : <Text className="infodata">{selectedItem.specvalueName}</Text></Text>
          <Text className="infotextdetail">商品名称 : <Text className="infodata">{selectedItem.pname}</Text></Text>
          <View className="imgview">
            <Image className="infoimg" src={selectedItem.pimage} />
          </View>
        </View>
      }
      {choose && sleoid && selectedItem &&
        <View className="orderinforow">
          <Text className="infotextdetail">种植数量</Text>
          <AtInputNumber
            className="pro-quantity"
            type='number'
            min={1}
            max={maxnum}
            step={1}
            value={quantityvalue}
            onChange={handleChange}
          />
        </View>

      }
      <View className="butsubrest">
        <AtButton className="yuyuebut" type='primary' size='small' onClick={handleSubmit}>提交</AtButton>
        <AtButton className="yuyuebut" type='primary' size='small' onClick={handleReset}>重置</AtButton>
      </View>
    </View>
  );
};

export default plantadd;
