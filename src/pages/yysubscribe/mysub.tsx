import React, {useEffect, useState} from 'react';
import './mysub.scss';
import {Button, Image, Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import request from '../../utils/request'
import {AtAccordion} from "taro-ui";
import "taro-ui/dist/style/components/accordion.scss";
import "taro-ui/dist/style/components/icon.scss";

const mysub = () => {
  const userInfo = Taro.getStorageSync('userInfo');
  const[yymysub,setYymysub]=useState([]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(()=>{
    if(userInfo){
      request({
        url: `/subscribe/findAllByUserid?userid=${userInfo.id}`,
        method: 'POST',
        header: {
          //'token': `Bearer ${Taro.getStorageSync('token')}`,
          'Content-Type': 'application/json',
        }
      }).then(res => {
        if (res.message === "success") {
          const proItems = res.data.map(item => ({
            subId: item.subId,
            plantId: item.plantId,
            subCate: item.subCate,
            subDate: item.subDate,
            subTime: item.subTime,
            subAdopt: item.subAdopt,
            subRemarks: item.subRemarks,
            subcreateTime: item.subcreateTime,
            subState: item.subState,
            pname: item.pname,
            pimage: item.pimage,
            isOpen: false, // 新增的展开状态
          }));
          //console.log(proItems);
          setYymysub(proItems);
        }
      }).catch(err => {
        Taro.showToast({
          title: '网络请求失败: ' + err.message,
          icon: 'none',
        });
      });
    }

  },[])

  const formatTime = (time) => {
    const date = new Date(time)
    // 格式化时间
    const formattedDateTime = `${date.getFullYear()}-${String(date.getMonth() + 1).
    padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).
    padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).
    padStart(2, '0')}`;

    return formattedDateTime;
  };

  // const [open, setOpen] = useState(false);
  //
  // const opensubdetail = () => {
  //   setOpen(!open);
  // };

  const opensubdetail = (index) => {
    const updatedYymysub = [...yymysub];
    updatedYymysub[index].isOpen = !updatedYymysub[index].isOpen;
    setYymysub(updatedYymysub);
  };

  const updatestate=(subid,state,index)=>{
    //console.log("当前单据状态："+state);
    if(parseInt(state) === 1){
      request({
        url: `/subscribe/updatemysubstate?mysubid=${subid}&newstate=0`,
        method: 'POST',
        header: {
          //'token': `Bearer ${Taro.getStorageSync('token')}`,
          'Content-Type': 'application/json',
        }
      }).then(res => {
        if (res.message === "success") {
          const updatedYymysub = [...yymysub];
          updatedYymysub[index].subState = '0';
          setYymysub(updatedYymysub);
          Taro.showToast({
            title: '成功取消单据',
            icon: 'success',
          });
        }
      }).catch(err => {
        Taro.showToast({
          title: '网络请求失败: ' + err.message,
          icon: 'none',
        });
      });
    }
  }

  //const [yystate,setYystate]=useState('已提交');
  const yystates = ['已取消','已提交','已处理','已被拒'];

  return (
    <View className="order">
      <Text className="ordertitle">我的预约</Text>
      {yymysub.map((item,index) => (
        <View  key={index} className='orderinfo' >
          <View className="main-container">
            <View className="image-container">
              <Image className="icon" src={item.pimage} />
            </View>
            <View className="text-container">
              <AtAccordion
                  open={item.isOpen}
                  onClick={() => opensubdetail(index)}
                  title={item.pname+'\u00A0\u00A0'+'|'+'\u00A0\u00A0'+item.plantId+'\u00A0\u00A0'+'|'+'\u00A0\u00A0'+item.subId}
                >
                <View className="left-text">
                  {/*<Text className="orderiteminfo">种植：{item.pname}{'\u00A0\u00A0'}|{'\u00A0\u00A0'}{item.plantId}</Text>*/}
                  <Text className="orderiteminfo">类型：{item.subCate}</Text>
                  <Text className="orderiteminfo">预约日期：{item.subDate}</Text>
                  <Text className="orderiteminfo">预约时间段：{item.subTime}</Text>
                  <Text className="orderiteminfo">预约处理量：{item.subAdopt}</Text>
                  <Text className="orderiteminfo">预约备注：{item.subRemarks}</Text>
                  <Text className="orderiteminfo">创建时间：{formatTime(item.subcreateTime)}</Text>
                  <Text className="orderiteminfo2">单据状态：<Text className={`orderiteminfo2inner inner-${item.subState}`}>{yystates[item.subState]}</Text></Text>
                  {parseInt(item.subState)===1&&
                    <Button className="cancel" onClick={()=>updatestate(item.subId,item.subState,index)}>取消预约</Button>}
                </View>
              </AtAccordion>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default mysub;
