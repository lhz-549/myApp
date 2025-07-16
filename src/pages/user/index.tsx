import {View, Image, Text, Button, Input} from '@tarojs/components';
import './index.scss';

import ceshi from '../../assets/ceshi.jpg';
import rongyu from '../../assets/rongyu.jpg';
import tree2 from '../../assets/tree2.jpg';
import feiliao from '../../assets/feiliao.jpg';
import shopping from '../../assets/shopping.jpg';
import shifei from '../../assets/shifei.jpg';
import fruits from '../../assets/fruits.jpg';

import Taro from "@tarojs/taro";
import {AtActionSheet, AtActionSheetItem, AtCheckbox, AtFloatLayout,} from "taro-ui";
import React, {useEffect, useState} from "react";
import 'taro-ui/dist/style/components/float-layout.scss';
import "taro-ui/dist/style/components/checkbox.scss";
import request from '../../utils/request'
import "taro-ui/dist/style/components/action-sheet.scss";


export default function Profile() {

  const [isOpened, setIsOpened] = useState(false);

  const handleOpen = () => {
    if(userInfo){
      handleOpenol();
    }else{
      setIsOpened(true);
    }
  };

  const handleClose = () => {
    setIsOpened(false);
  };

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleSendCode = () => {
    // if (isAgreementChecked.length === 0) {
    //   Taro.showToast({
    //     title: "请先同意用户协议",
    //     icon: "none",
    //   });
    //   return;
    // }
    if (!phone) {
      Taro.showToast({
        title: '请输入邮箱号',
        icon: 'none',
      });
      return;
    }
    request({
      url: `/sendEamil?objto=${phone}`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
      }
    }).then(res=>{
      if (res.message === "success") {
        setIsCodeSent(true);
        setCountdown(60);
        if (timer) {
          clearInterval(timer);
        }
        const newTimer = setInterval(() => {
          setCountdown((prevCountdown) => {
            if (prevCountdown <= 1) {
              clearInterval(newTimer);
              return 0;
            }
            return prevCountdown - 1;
          });
        }, 1000);
        setTimer(newTimer);
        // 模拟发送验证码请求
        Taro.showToast({
          title: '验证码已发送',
          icon: 'success',
        });
      } else {
        Taro.showToast({
          title: '验证码失败: ' + res.message,
          icon: 'none',
        });
      }
    })
      .catch(err => {
        Taro.showToast({
          title: '登录请求失败: ' + err.message,
          icon: 'none',
        });
      });
  };

  const [isAgreementChecked, setIsAgreementChecked] = useState([]); // 用户协议选中状态
  const handleAgreementChange = (value) => {
    setIsAgreementChecked(value);
  };

  const handleLogin = () => {
    if (isAgreementChecked.length === 0) {
      Taro.showToast({
        title: "请先同意用户协议",
        icon: "none",
      });
      return;
    }

    if (!phone || !code) {
      Taro.showToast({
        title: '请输入邮箱号和验证码',
        icon: 'none',
      });
      return;
    }

    request({
      url: `/user/loginbyyzm?email=${phone}&code=${code}`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
      }
    }).then(res=>{
      if (res.message === "success") {

        const {user,access_token} = res.data;
        Taro.setStorageSync('userInfo', user);
        console.log(user);
        Taro.setStorageSync('token', access_token);
        // 获取用户的 id 和 name
        setUserid(user.account);
        setNicheng(user.name);
        setUserHeadPortrait(user.headPortrait);
        initcardbottomdata(user.id);

        //新增登录清楚退出标记
        if(Taro.getStorageSync('logout')){
          console.log("重新登录清除退出标记")
          Taro.removeStorageSync('logout');
        }
        Taro.eventCenter.trigger('login');

        setTimeout(() => {
          setIsOpened(false);
          setCode("");
          setPhone("");
          setIsAgreementChecked([]);
          setIsCodeSent(false);
          Taro.showToast({
            title: '登录成功',
            icon: 'success',
          });
          // 跳转到首页或者其他逻辑
          // Taro.redirectTo({ url: '/pages/home/index' });
        }, 500);
      } else {
        Taro.showToast({
          title: '登录失败: ' + res.message,
          icon: 'none',
        });
      }
    })
      .catch(err => {
        Taro.showToast({
          title: '登录请求失败: ' + err.message,
          icon: 'none',
        });
    });
  };


  // const [nicheng,setNicheng ]= useState("微信用户");
  const [nicheng,setNicheng ]= useState("请先登录");
  const [userid , setUserid]=useState("24*****14");
  const [userHeadPortrait,setUserHeadPortrait]=useState(ceshi);

  const userInfo = Taro.getStorageSync('userInfo');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    Taro.eventCenter.on('updateoneifo', updateoneinfobyuid );
    // 组件卸载时取消监听

    //console.log(userInfo+userInfo.toString());
    // updateoneinfobyuid();
    if(userInfo){
      setUserid(userInfo.account);
      setNicheng(userInfo.name);
      setUserHeadPortrait(userInfo.headPortrait);
    }
    return () => {
      Taro.eventCenter.off('updateoneifo', );
    };
  }, );

  const updateoneinfobyuid=()=>{
    if(userInfo){
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
          const updatedUserInfo = {
            ...userInfo,
            name: resultdata.name,
            headPortrait: resultdata.headPortrait,
          };
          Taro.removeStorageSync('userInfo');
          Taro.setStorageSync('userInfo', updatedUserInfo);
          setUserid(resultdata.account);
          setNicheng(resultdata.name);
          setUserHeadPortrait(resultdata.headPortrait);
        }
      }).catch(err => {
        Taro.showToast({
          title: '网络请求失败',
          icon: 'none',
        });
      });
    }
  };

  // 授权获取手机号
  // const getPhoneNumber = async (e: any) => {
  //   console.log(e.detail, "获取手机号回调");
  // };

  const openorderlist=()=>{
    if(userInfo){
      Taro.navigateTo({
        //Taro.redirectTo({
        // Taro.switchTab({
        url: '/pages/orderlist/order',
      });
    }else {
      Taro.showToast({
        title: '请先登录账号',
        icon: 'none',
      });
    }
  };

  const YHRecord=()=>{if(userInfo){
    Taro.navigateTo({
      url: `/pages/yhrecord/record`,
    });} else {
    Taro.showToast({
      title: '请先登录账号',
      icon: 'none',
    });
  }
  }
  const YHRecord2=()=>{if(userInfo){
    Taro.navigateTo({
      url: `/pages/yhballs/balls`,
    });}else {
    Taro.showToast({
      title: '请先登录账号',
      icon: 'none',
    });
  }
  }
  const [plantnum,setPlantnum]=useState(0);
  const [recordnum,setRecordnum]=useState(0);
  const [achievement,setAchievement]=useState(0);
  const [achnum,setAchnum]=useState(0);
  useEffect(()=>{
    if(userInfo){
      initcardbottomdata(userInfo.id);
    }
  },[])

  const initcardbottomdata = (userid) => {

    request({
      url: `/maintainrecord/selrecordnum?userid=${userid}`,
      method: 'POST',
      header: {//'token': `Bearer ${Taro.getStorageSync('token')}`,
        'Content-Type': 'application/json',}}).then(res => {
      if (res.message === "success") {setRecordnum(res.data);}});
    request({
      url: `/plant/selplantnum?userid=${userid}`,
      method: 'POST',
      header: {//'token': `Bearer ${Taro.getStorageSync('token')}`,
        'Content-Type': 'application/json',}}).then(res => {
      if (res.message === "success") {setPlantnum(res.data);}});
    //成就数目和数值
    request({
      url: `/achievesuccess/selallachsuccessbyuserid?userid=${userid}`,
      method: 'POST',
      header: {//'token': `Bearer ${Taro.getStorageSync('token')}`,
        'Content-Type': 'application/json',}}).then(res => {
      if (res.message === "success") {
        const proItems = res.data.map(item => ({
          asId: item.asId,
          achExp: parseInt(item.achExp, 10),
        }));
        setAchievement(proItems.length);
        const totalAchExp = proItems.reduce((sum, item) => sum + item.achExp, 0);
        setAchnum(totalAchExp.toString());
        //console.log(proItems);
      }});
  };

  const openplant=()=>{
    if(userInfo){
      Taro.navigateTo({
      url: '/pages/ytrees/mytree',
    });}else {
      Taro.showToast({
        title: '请先登录账号',
        icon: 'none',
      });
    }
  };
  const openmysub=()=>{
    if(userInfo){
      Taro.navigateTo({
        url: '/pages/yysubscribe/mysub',
      });
    }else {
      Taro.showToast({
        title: '请先登录账号',
        icon: 'none',
      });
    }
  }
  const Achievement=()=>{
    Taro.navigateTo({
      url: '/pages/yhach/achieve',
    });
  };


  const [countdown, setCountdown] = useState(0);
  const [timer, setTimer] = useState(null);
  const rehandleSendCode = () => {
    // 重发送验证码的逻辑
    if(countdown>0){
      Taro.showToast({
        title: '请稍后重试',
        icon: 'none',
      });
    }else{
      handleSendCode();
    }
  };

  useEffect(() => {
    // 清理计时器
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [timer]);


  const [isoutlogin, setIsoutlogin] = useState(false);
  const handleOpenol = () => {
    setIsoutlogin(true);
  };
  const handleCloseol = () => {
    setIsoutlogin(false);
  };
  const handleItemClick = (index) => {
    // 根据索引处理不同的操作
    if (index === 0) {
      // 修改个人资料的操作
      handleCloseol();
      Taro.navigateTo({
        url: 'personaldata/personaldata',
      });
      //console.log('修改个人资料');
    } else if (index === 1) {
      // 退出登录状态的操作
      Taro.showModal({
        title: '提示',
        content: '是否确认退出登录？',
        success: function (res) {
          if (res.confirm) {
            Taro.removeStorageSync('login');
            Taro.removeStorageSync('userInfo');
            setUserid("24*****14");
            setNicheng("请先登录");
            setUserHeadPortrait(ceshi);
            setPlantnum(0);
            setRecordnum(0);
            setAchievement(0);
            setAchnum(0);
            handleCloseol();
            Taro.eventCenter.trigger('logout');
          } else if (res.cancel) {}
        }
      });
      //console.log('退出登录状态');
    }
  };

  return (
    <View className="profile">
      <View className="header">
        <Text className="username" onClick={handleOpen}>{nicheng}</Text>
        <Text className="user-id">用户编号: {userid}</Text>
      </View>
      <View className="card-container">
        <Image className="avatar" src={userHeadPortrait} onClick={handleOpen}/>
        <View className="membership-card">
          <Text className="card-text">成就值{'\u00A0\u00A0'}|{'\u00A0\u00A0'}{achnum}</Text>
        </View>
      </View>
      <View className="stats">
        <View className="stat-item">
          <Text className="number">{plantnum}</Text>
          <Text className="label">种植数量</Text>
        </View>
        <View className="stat-item">
          <Text className="number">{recordnum}</Text>
          <Text className="label">培养记录</Text>
        </View>
        <View className="stat-item">
          <Text className="number">{achievement}</Text>
          <Text className="label">获得成就</Text>
        </View>
      </View>
      <View className="menu">
        <View className="menu-item" onClick={openorderlist}>
          <Image className="icon" src={shopping} />
          <Text>我的订单</Text>
        </View>
        <View className="menu-item" onClick={openplant}>
          <Image className="icon" src={tree2} />
          <Text>我的果树</Text>
        </View>
        <View className="menu-item" onClick={openmysub}>
          <Image className="icon" src="https://i.111666.best/image/I1cAImvtGiRVdgIZlREv1F.png" />
          <Text>我的预约</Text>
        </View>
        <View className="menu-item" onClick={Achievement}>
          <Image className="icon" src={rongyu} />
          <Text>我的成就</Text>
        </View>
        <View className="menu-item" onClick={YHRecord}>
          <Image className="icon" src={shifei} />
          <Text>养护记录</Text>
        </View>
        <View className="menu-item" onClick={YHRecord2}>
          <Image className="icon"
                 src={feiliao}
            // src="https://i.111666.best/image/qSAw7lRS9JZDFcqHgz9N7a.png"
          />
          <Text>助力能量</Text>
        </View>
        <View className="menu-item">
          <Image className="icon" src={fruits} />
          <Text>果脯收获</Text>
        </View>
      </View>
      <View>
        {/*<Button onClick={handleOpen}>打开浮动层</Button>*/}
        <AtFloatLayout isOpened={isOpened}  onClose={handleClose}
                       // title="YGLogin"
        >
          <View className="login">
            <View className="login-form">
              <Text className="login-title">YGLogin</Text>
              <Input
                type="text"
                placeholder="请输入邮箱号"
                value={phone}
                onInput={handlePhoneChange}
                className="login-input"
              />
              {isCodeSent &&
                <View className="yzm-view">
                  <Input
                    // type="number"
                    type="text"
                    placeholder="请输入验证码"
                    value={code}
                    onInput={handleCodeChange}
                    className="login-input2"
                  />
                  <Button className="login-button2"
                          onClick={rehandleSendCode}>{countdown > 0 ? `${countdown}s` : '重新获取'}</Button>
                </View>
              }
              {!isCodeSent ? (
                <Button className="login-button" onClick={handleSendCode}>
                  获取验证码
                </Button>
              ) : (
                <Button className="login-button" onClick={handleLogin}>
                  登录
                </Button>
              )}

              <View className="agreement">
                <AtCheckbox
                  className="userassert"
                  options={[
                    {
                      label: (
                        <View>
                          已阅读并同意
                          <Text className="agreement-link">《用户协议》</Text>
                          <Text className="agreement-link">《隐私政策》</Text>
                        </View>
                      ),
                      value: 'agreement'
                    },
                  ]}
                  selectedList={isAgreementChecked}
                  onChange={handleAgreementChange}
                />
              </View>

              {/*<View className="agreement">*/}
              {/*  <Checkbox*/}
              {/*    checked={isAgreementChecked}*/}
              {/*    onChange={handleAgreementChange}*/}
              {/*  >*/}
              {/*    <Text className="agreement-text">已阅读并同意</Text>*/}
              {/*  </Checkbox>*/}
              {/*  <Text className="agreement-link">《用户协议》</Text>*/}
              {/*  <Text className="agreement-link">《隐私政策》</Text>*/}
              {/*</View>*/}

            </View>
          </View>
        </AtFloatLayout>
        {/*<View>*/}
        {/*  <Button*/}
        {/*    type="primary"*/}
        {/*    openType="getPhoneNumber"*/}
        {/*    onGetPhoneNumber={getPhoneNumber}*/}
        {/*  >*/}
        {/*    手机号码一键登录*/}
        {/*  </Button>*/}
        {/*</View>*/}
        <AtActionSheet
          isOpened={isoutlogin}
          cancelText='取消'
          onClose={handleCloseol}
          onCancel={handleCloseol}
        >
          <AtActionSheetItem onClick={() => handleItemClick(0)}>
            修改个人资料
          </AtActionSheetItem>
          <AtActionSheetItem onClick={() => handleItemClick(1)}>
            退出登录状态
          </AtActionSheetItem>
        </AtActionSheet>
      </View>
    </View>
  );



}
