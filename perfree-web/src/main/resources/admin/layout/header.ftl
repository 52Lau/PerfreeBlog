<div class="layui-header f-header">

    <ul class="layui-nav layui-layout-left left-nav f-nav">
        <li class="layui-nav-item" lay-unselect>
            <a href="javascript:;" title="收缩菜单" class="f-switch-side-btn f-switch-btn-on"><i class="layui-icon layui-icon-shrink-right"></i></a>
            <a href="javascript:;" title="展开菜单" class="f-switch-side-btn f-switch-btn-off" style="display: none;"><i class="layui-icon layui-icon-spread-left"></i></a>
        </li>
        <li class="layui-nav-item" lay-unselect><a href="javascript:;" class="f-refresh-btn" title="刷新"><i class="layui-icon layui-icon-refresh"></i></a></li>
    </ul>

    <ul class="layui-nav layui-layout-right header-right f-nav">
        <li class="layui-nav-item" lay-unselect><a href="javascript:;" title="主题" class="f-theme-btn"><i class="layui-icon layui-icon-theme"></i></a></li>
        <li class="layui-nav-item" lay-unselect>
            <a href="javascript:;" class="f-screen-full-btn" title="全屏/退出全屏">
                <i class="layui-icon layui-icon-screen-full f-screen-full-btn-icon"></i>
                <i class="layui-icon layui-icon-screen-restore f-exit-full-btn-icon"></i>
            </a>
        </li>
        <li class="layui-nav-item" lay-unselect>
            <a href="javascript:;">
                <#if (user.avatar)?? && (user.avatar) != ''>
                    <img src="${(user.avatar)}" class="layui-nav-img">
                <#else>
                    <img src="/public/images/user.png" class="layui-nav-img">
                </#if>

                ${user.userName}
            </a>
            <dl class="layui-nav-child" >
                <dd lay-unselect><a href="javascript:;" onclick="userCenter()">个人中心</a></dd>
                <dd lay-unselect><a href="javascript:;" onclick="logout()">退出登录</a></dd>
            </dl>
        </li>
    </ul>
</div>