let table, form;
layui.use(['table', 'layer', 'form'], function () {
    table = layui.table;
    form = layui.form;
    initPage();
});

/**
 * 页面初始化事件
 */
function initPage() {
    queryTable();
    loadRoleList();

    layer.config({
        offset: '20%'
    });

    // 查询
    $("#queryBtn").click(function () {
        queryTable();
    });

    // 添加
    $("#addBtn").click(function () {
        layer.open({
            title: "添加用户",
            type: 2,
            area: common.layerArea($("html")[0].clientWidth, 500, 400),
            shadeClose: true,
            anim: 1,
            content: '/admin/user/addPage'
        });
    });

    // 批量删除
    $("#batchDeleteBtn").click(function () {
        const checkStatus = table.checkStatus('tableBox'), data = checkStatus.data;
        if (data.length <= 0) {
            layer.msg("至少选择一条数据", {icon: 2});
        } else {
            let ids = "";
            data.forEach(res => {
                ids += res.id + ",";
            });
            ids = ids.substring(0, ids.length - 1);
            deleteData(ids)
        }
    });
}


/**
 * 查询表格数据
 */
function queryTable() {
    table.render({
        elem: '#tableBox',
        url: '/admin/user/list',
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        contentType: 'application/json',
        title: '用户列表',
        totalRow: false,
        where: {
            form: {
                userName: $("#userName").val(),
                roleId: $("#roleId").val(),
            }
        },
        limit: 30,
        cols: [[
            {type: 'checkbox'},
            {field: 'id', title: 'ID', width: 80,  sort: true},
            {field: 'userName', minWidth: 80,title: '用户名'},
            {field: 'account', minWidth: 150,title: '账户'},
            {field: 'email', minWidth: 180,title: '邮箱'},
            {field: 'website', minWidth: 180,title: '网站'},
            {
                field: 'status', minWidth: 100,title: '状态',
                templet: function (d) {
                    let html;
                    if (d.status === 0) {
                        html = "<input type='checkbox' name='status' lay-filter='status' lay-skin='switch' value='" + d.id + "' lay-text='正常|禁用' checked>";
                    } else {
                        html = "<input type='checkbox' name='status' lay-filter='status' value='" + d.id + "' lay-skin='switch' lay-text='正常|禁用'>";
                    }
                    return html;
                }
            },
            {
                field: 'avatar', minWidth: 80,title: '头像', templet: function (d) {
                    let html = '';
                    if (d.avatar !== null && d.avatar !== '') {
                        html = "<img src='" + d.avatar + "' layer-src='" + d.avatar + "'>";
                    }
                    return html;
                }
            },
            {field: 'role', minWidth: 110,title: '角色', templet: "<span>{{d.role.name}}</span>"},
            {
                field: 'createTime',
                title: '创建时间',
                sort: true,
                minWidth: 160,
                templet: "<span>{{d.createTime == null? '' :layui.util.toDateString(d.createTime, 'yyyy-MM-dd HH:mm:ss')}}</span>"
            },
            {
                field: 'updateTime',
                title: '更新时间',
                sort: true,
                minWidth: 160,
                templet: "<span>{{d.updateTime == null ? '' :layui.util.toDateString(d.updateTime, 'yyyy-MM-dd HH:mm:ss')}}</span>"
            },
            {
                field: 'id', title: '操作', width: 180,
                templet: "<div>" +
                    "<a class='layui-btn layui-btn-normal layui-btn-xs' onclick='editData(\"{{d.id}}\")'>编辑</a> " +
                    "<a class='layui-btn layui-btn-danger layui-btn-xs' onclick='resetPassword(\"{{d.id}}\")'>重置密码</a>" +
                    "<a class='layui-btn layui-btn-danger layui-btn-xs' onclick='deleteData(\"{{d.id}}\")'>删除</a>" +
                    "</div>"
            },
        ]],
        page: true,
        response: {statusCode: 200},
        parseData: function (res) {
            return {
                "code": res.code,
                "msg": res.msg,
                "count": res.total,
                "data": res.data
            };
        },
        request: {
            pageName: 'pageIndex',
            limitName: 'pageSize'
        }
    });

    form.on('switch(status)', function (data) {
        const id = this.value;
        const status = this.checked ? 0 : 1;
        changeStatus(id, status);
    });
}

/**
 * 编辑
 * @param id
 */
function editData(id) {
    layer.open({
        title: "编辑用户",
        type: 2,
        area: common.layerArea($("html")[0].clientWidth, 500, 400),
        shadeClose: true,
        anim: 1,
        content: '/admin/user/editPage/' + id
    });
}

/**
 *
 * @param ids
 */
function deleteData(ids) {
    layer.confirm('确定要删除吗?', {icon: 3, title: '提示'}, function (index) {
        $.ajax({
            type: "POST",
            url: "/admin/user/del",
            contentType: "application/json",
            data: ids,
            success: function (data) {
                if (data.code === 200) {
                    queryTable();
                    layer.msg(data.msg, {icon: 1});
                } else {
                    layer.msg(data.msg, {icon: 2});
                }
            },
            error: function (data) {
                layer.msg("删除失败", {icon: 2});
            }
        });
        layer.close(index);
    });
}

/**
 * 加载角色列表
 */
function loadRoleList() {
    $.get('/admin/role/getRoleList', function (data) {
        let html = '<option value="">请选择</option>';
        data.data.forEach(res => {
            html += ' <option value="' + res.id + '">' + res.name + '</option>';
        });
        $("#roleId").html(html);
        form.render('select');
    });
}

/**
 * 重置密码
 * @param id
 */
function resetPassword(id) {
    layer.confirm('确定要重置密码为123456吗?', {icon: 3, title: '提示'}, function (index) {
        $.ajax({
            type: "POST",
            url: "/admin/user/resetPassword",
            contentType: "application/json",
            data: JSON.stringify({id: id}),
            success: function (data) {
                if (data.code === 200) {
                    queryTable();
                    layer.msg(data.msg, {icon: 1});
                } else {
                    layer.msg(data.msg, {icon: 2});
                }
            },
            error: function (data) {
                layer.msg("重置失败", {icon: 2});
            }
        });
        layer.close(index);
    });
}

/**
 * 改变状态
 * @param id id
 */
function changeStatus(id, status) {
    $.ajax({
        type: "POST",
        url: "/admin/user/changeStatus",
        contentType: "application/json",
        data: JSON.stringify({id: id, status: status}),
        success: function (data) {
            if (data.code === 200) {
                queryTable();
                layer.msg(data.msg, {icon: 1});
            } else {
                layer.msg(data.msg, {icon: 2});
            }
        },
        error: function (data) {
            layer.msg("修改状态失败", {icon: 2});
        }
    });
}