import React, {useEffect, useState} from 'react';
import './personaldata.scss';
import {Button, Image, Input, Picker, Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import request from '../../../utils/request'
import ceshi from "../../../assets/ceshi.jpg";

const personaldata = () => {

  const userInfo = Taro.getStorageSync('userInfo');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(()=>{
    request({
      url: `/user/seluserinfobyuserid?uid=${userInfo.id}`,
      method: 'POST',
      header: {
        //'token': `Bearer ${Taro.getStorageSync('token')}`,
        'Content-Type': 'application/json',
      }
    }).then(res => {
      if (res.message === "success") {
        const resultdata = res.data;
        setOneData(resultdata);
      }
    }).catch(err => {
      Taro.showToast({
        title: '网络请求失败',
        icon: 'none',
      });
    });
  },[])

  const [oneData,setOneData]= useState({}); // 从后端获取的时间字符串

  const formatTime = (time) => {
    const date = new Date(time)
    // 格式化时间
    const formattedDateTime = `${date.getFullYear()}-${String(date.getMonth() + 1).
    padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).
    padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).
    padStart(2, '0')}`;
    return formattedDateTime;
  };

  const showpassword = (pd) => {
    if (!pd || pd === null) {
      return "******";
    } else {
      return "*".repeat(pd);
    }
  }

  const [isopen, setIsopen] = useState(false);
  const handleOpen = () => {
    setIsopen(true);
  };
  const handleClose = () => {
    Taro.showModal({
      title: '提示',
      content: '是否确认修改个人信息？',
      success: function (res) {
        if (res.confirm) {
          request({
            url: `/user/updateuserinfobyuserid`,
            method: 'POST',
            header: {
              //'token': `Bearer ${Taro.getStorageSync('token')}`,
              'Content-Type': 'application/json',
            },
            data:{
              id: userInfo.id,
              name: oneData.name,
              phone: oneData.phone,
              headPortrait: oneData.headPortrait,
              birthday: oneData.birthday
            }
          }).then(res => {
            if (res.message === "success"&&res.data === 1) {
              Taro.showToast({
                title: '修改完成',
                icon: 'none',
              });
              setIsopen(false);
              Taro.eventCenter.trigger('updateoneifo');
            }else{
              Taro.showToast({
                title: res.data,
                icon: 'none',
              });
            }
          }).catch(err => {
            Taro.showToast({
              title: '网络请求失败',
              icon: 'none',
            });
          });
        } else if (res.cancel) {

        }
      }
    });

  };
  const handleInputChange = (field, value) => {
    console.log(value);
    setOneData({
      ...oneData,
      [field]: value
    });
  };

  const [oldpw,setOldpw]= useState("");
  const [newpw,setNewpw]= useState("");
  const handleInputChange2 = (field, value) => {
    console.log(field+"________"+value);
    if(field==='oldpw'){
      setOldpw(value);
    }else if(field==='newpw'){
      setNewpw(value);
    }
  };

  const [isopen2, setIsopen2] = useState(false);
  const handleOpen2 = () => {
    setIsopen2(true);
  };
  const handleClose2 = () => {
    if(newpw.length>=8){
      request({
        url: `/user/updatepwbyuserid?uid=${userInfo.id}&oldpw=${oldpw}&newpw=${newpw}`,
        method: 'POST',
        header: {
          //'token': `Bearer ${Taro.getStorageSync('token')}`,
          'Content-Type': 'application/json',
        },
      }).then(res => {
        if (res.message === "success"&&res.data === 1) {
          Taro.showToast({
            title: '修改完成',
            icon: 'none',
          });
          setIsopen2(false);
          setOldpw("");
          setNewpw("");
        }else {
          Taro.showToast({
            title: res.data,
            icon: 'none',
          });
        }
      }).catch(err => {
        Taro.showToast({
          title: '网络请求失败',
          icon: 'none',
        });
      });
    }else{
      Taro.showToast({
        title: '口令至少由8位及以上大小写字母、数字及特殊字符等混合、随机组成(至少包括三种)',
        icon: 'none',
      });
    }

  }

  return (
    <View className="onedata-col">
      <View className="oneinfo-col">
        <View className='oneinfo-row'>
          <Text className='oneinfo-item'>头像</Text>
          <Image className='oneinfo-img' src={oneData.headPortrait} />
        </View>
        <View className='oneinfo-row'>
          <Text className='oneinfo-item'>昵称</Text>
          {!isopen&&<Text className='oneinfo-det'>{oneData.name}</Text>}
          {isopen&&<Input
            type="text"
            placeholder={"(Edit)"+oneData.name}
            value={oneData.name}
            onInput={(e) => handleInputChange('name', e.target.value)}
            className="info-input"
          />}
        </View>
        <View className='oneinfo-row'>
          <Text className='oneinfo-item'>手机号码</Text>
          {!isopen&&<Text className='oneinfo-det'>{oneData.phone}</Text>}
          {isopen&&<Input
            type="text"
            placeholder={"(Edit)"+oneData.phone}
            value={oneData.phone}
            onInput={(e) => handleInputChange('phone', e.target.value)}
            className="info-input"
          />}
        </View>
        <View className='oneinfo-row'>
          <Text className='oneinfo-item'>登录账号</Text>
          <Text className='oneinfo-det'>{oneData.email}</Text>
        </View>
        <View className='oneinfo-row'>
          <Text className='oneinfo-item'>用户编号</Text>
          <Text className='oneinfo-det'>{oneData.account}</Text>
        </View>
        <View className='oneinfo-row'>
          <Text className='oneinfo-item'>出生日期</Text>
          {!isopen&&<Text className='oneinfo-det'>{oneData.birthday}</Text>}
          {isopen &&
            <Picker
              mode="date"
              onChange={(e) => handleInputChange('birthday', e.detail.value)}
              value={oneData.birthday}
            >
              <Text className="info-input">
                {oneData.birthday ? oneData.birthday : "选择日期"}
              </Text>
            </Picker>
          }
        </View>
        <View className='oneinfo-row'>
          <Text className='oneinfo-item'>创建时间</Text>
          <Text className='oneinfo-det'>{formatTime(oneData.createTime)}</Text>
        </View>
      </View>
      <View className="oneinfo-col">
        <View className='oneinfo-row'>
          <Text className='oneinfo-item'>支付密码</Text>
          <Text className='oneinfo-det'>{showpassword(oneData.password)}</Text>
        </View>
        {!isopen2&&
          <View className='oneinfo-row'>
            <Button className="updatepaybutton" onClick={handleOpen2}>修改密码</Button>
          </View>
        }
        {isopen2 &&
          <View className='oneinfo-row'>
            <Text className='oneinfo-item'>原密码</Text>
            <Input
              type="text"
              placeholder='请输入原始密码'
              value={oldpw}
              onInput={(e) => handleInputChange2('oldpw', e.target.value)}
              className="info-input"
            />
          </View>
        }
        {isopen2 &&
          <View className='oneinfo-row'>
            <Text className='oneinfo-item'>新密码</Text>
            <Input
              type="text"
              placeholder='请输入新密码'
              value={newpw}
              onInput={(e) => handleInputChange2('newpw', e.target.value)}
              className="info-input"
            />
          </View>
        }
        {isopen2 &&
          <View className='oneinfo-row'>
            <Button className="updatepaybutton" onClick={handleClose2}> 提交密码修改</Button>
          </View>
        }
      </View>

      {!isopen&&<Button className="oneinfobutton" onClick={handleOpen}>编辑</Button>}
      {isopen&&<Button className="oneinfobutton" onClick={handleClose}>完成</Button>}

    </View>
  );
};

export default personaldata;
