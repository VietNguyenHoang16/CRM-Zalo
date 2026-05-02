import { PrismaClient } from '@prisma/client'
import type { CustomerStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const sourceFacebook = await prisma.customerSource.upsert({
    where: { code: 'FACEBOOK' },
    update: {},
    create: { code: 'FACEBOOK', name: 'Facebook' },
  })

  const sourceZalo = await prisma.customerSource.upsert({
    where: { code: 'ZALO' },
    update: {},
    create: { code: 'ZALO', name: 'Zalo' },
  })

  const sourceWebsite = await prisma.customerSource.upsert({
    where: { code: 'WEBSITE' },
    update: {},
    create: { code: 'WEBSITE', name: 'Website' },
  })

  console.log('Sources seeded')

  const catChaoMoi = await prisma.templateCategory.upsert({
    where: { code: 'CHAO_MOI' },
    update: {},
    create: { code: 'CHAO_MOI', name: 'Chào mời' },
  })

  const catReconnect = await prisma.templateCategory.upsert({
    where: { code: 'RECONNECT' },
    update: {},
    create: { code: 'RECONNECT', name: 'Reconnect' },
  })

  const catChamSoc = await prisma.templateCategory.upsert({
    where: { code: 'CHAM_SOC' },
    update: {},
    create: { code: 'CHAM_SOC', name: 'Chăm sóc' },
  })

  const catKhac = await prisma.templateCategory.upsert({
    where: { code: 'KHAC' },
    update: {},
    create: { code: 'KHAC', name: 'Khác' },
  })

  console.log('Categories seeded')

  await prisma.messageTemplate.deleteMany()
  await Promise.all([
    prisma.messageTemplate.create({ data: { title: 'Chào mời sản phẩm mới', content: 'Chào {ten},\n\nBên em có sản phẩm mới ra mắt với nhiều ưu đãi hấp dẫn dành cho khách hàng từ {nguon}. Anh/chị có muốn tìm hiểu thêm không ạ?\n\nLiên hệ: {sdt}', categoryId: catChaoMoi.id } }),
    prisma.messageTemplate.create({ data: { title: 'Chào mời khuyến mãi tháng', content: 'Xin chào {ten},\n\nTháng này bên em đang có chương trình khuyến mãi cực lớn. Giảm đến 50% cho khách hàng mới. Anh/chị sắp xếp ghé qua nhé!\n\nHotline: {sdt}', categoryId: catChaoMoi.id } }),
    prisma.messageTemplate.create({ data: { title: 'Giới thiệu dịch vụ mới', content: 'Chào anh/chị {ten},\n\nBên em vừa triển khai dịch vụ chăm sóc khách hàng VIP hoàn toàn mới. Với nhiều đặc quyền chỉ dành cho khách hàng thân thiết từ {nguon}.\n\nAnh/chị quan tâm nhắn lại em tư vấn ngay nhé!\n\nSĐT: {sdt}', categoryId: catChaoMoi.id } }),
    prisma.messageTemplate.create({ data: { title: 'Mời tham dự sự kiện', content: 'Kính mời {ten},\n\nBên em tổ chức sự kiện tri ân khách hàng vào cuối tuần này. Có quà tặng và ưu đãi độc quyền cho khách từ {nguon}. Anh/chị tham gia nhé!\n\nXác nhận qua: {sdt}', categoryId: catChaoMoi.id } }),
    prisma.messageTemplate.create({ data: { title: 'Reconnect khách cũ', content: 'Chào {ten},\n\nLâu rồi không gặp anh/chị. Bên em có chương trình tri ân khách hàng cũ với nhiều phần quà hấp dẫn. Anh/chị có muốn tham khảo thêm không ạ?', categoryId: catReconnect.id } }),
    prisma.messageTemplate.create({ data: { title: 'Follow up sau 1 tuần', content: 'Chào {ten},\n\nCách đây 1 tuần mình có trao đổi về sản phẩm bên em. Không biết anh/chị đã có quyết định chưa ạ? Nếu cần thêm thông tin em sẵn sàng hỗ trợ.\n\nSĐT: {sdt}', categoryId: catReconnect.id } }),
    prisma.messageTemplate.create({ data: { title: 'Nhắc lại khách quan tâm', content: 'Xin chào {ten},\n\nTrước đây anh/chị có quan tâm đến dịch vụ bên em nhưng chưa sắp xếp được thời gian. Hiện tại bên em có ưu đãi mới, anh/chị có muốn cập nhật không ạ?\n\nLiên hệ lại: {sdt}', categoryId: catReconnect.id } }),
    prisma.messageTemplate.create({ data: { title: 'Chăm sóc sau mua hàng', content: 'Chào {ten},\n\nCảm ơn anh/chị đã tin tưởng lựa chọn sản phẩm bên em. Em chỉ muốn hỏi thăm anh/chị dùng sản phẩm có tốt không ạ? Nếu cần hỗ trợ gì cứ nhắn em nhé.', categoryId: catChamSoc.id } }),
    prisma.messageTemplate.create({ data: { title: 'Chúc mừng sinh nhật', content: 'Chúc mừng sinh nhật {ten}! 🎂\n\nChúc anh/chị một ngày sinh nhật thật vui vẻ và hạnh phúc bên gia đình. Bên em có món quà nhỏ dành tặng anh/chị, ghé qua nhận nhé!\n\n{nguon} - {sdt}', categoryId: catChamSoc.id } }),
    prisma.messageTemplate.create({ data: { title: 'Hỏi thăm sức khỏe', content: 'Xin chào {ten},\n\nDạo này anh/chị và gia đình vẫn khỏe chứ ạ? Bên em đang có chương trình kiểm tra sức khỏe miễn phí cho khách hàng từ {nguon}. Anh/chị quan tâm em gửi thông tin chi tiết nhé.', categoryId: catChamSoc.id } }),
    prisma.messageTemplate.create({ data: { title: 'Nhắc lịch hẹn gặp', content: 'Chào {ten},\n\nEm chỉ muốn nhắc lại lịch hẹn của mình vào ngày mai ạ. Anh/chị sắp xếp thời gian ghé qua bên em nhé. Có gì thay đổi anh/chị báo em trước nha.\n\nĐịa chỉ: {nguon} - {sdt}', categoryId: catKhac.id } }),
    prisma.messageTemplate.create({ data: { title: 'Gửi báo giá sản phẩm', content: 'Kính gửi {ten},\n\nTheo yêu cầu của anh/chị, em gửi báo giá chi tiết:\n\n- Gói cơ bản: 5,000,000đ\n- Gói nâng cao: 8,500,000đ\n- Gói VIP: 12,000,000đ\n\nAnh/chị xem qua và phản hồi em nhé.\n\nHotline: {sdt}', categoryId: catKhac.id } }),
    prisma.messageTemplate.create({ data: { title: 'Thông báo lịch nghỉ lễ', content: 'Xin chào {ten},\n\nBên em xin thông báo lịch nghỉ lễ sắp tới. Mọi thắc mắc anh/chị vui lòng liên hệ trước để được hỗ trợ kịp thời ạ.\n\nCảm ơn anh/chị đã đồng hành cùng {nguon}.\n\nHotline: {sdt}', categoryId: catKhac.id } }),
  ])

  console.log('Templates seeded')

  await prisma.customer.deleteMany()
  await Promise.all([
    prisma.customer.create({ data: { name: 'Nguyễn Văn An', phone: '0909123456', email: 'an.nguyen@email.com', sourceId: sourceFacebook.id, status: 'PENDING_ZALO' as CustomerStatus } }),
    prisma.customer.create({ data: { name: 'Trần Thị Bình', phone: '0909123457', sourceId: sourceZalo.id, status: 'ZALO_CONNECTED' as CustomerStatus, zaloAcceptedAt: new Date() } }),
    prisma.customer.create({ data: { name: 'Lê Văn Cường', phone: '0909123458', sourceId: sourceWebsite.id, status: 'NEW' as CustomerStatus } }),
    prisma.customer.create({ data: { name: 'Phạm Thị Dung', phone: '0909123459', sourceId: sourceFacebook.id, status: 'CONTACTED' as CustomerStatus } }),
    prisma.customer.create({ data: { name: 'Hoàng Văn Em', phone: '0909123460', sourceId: sourceZalo.id, status: 'MESSAGED' as CustomerStatus } }),
  ])

  console.log('Customers seeded')

  await prisma.settings.upsert({
    where: { id: 'global' },
    update: {},
    create: { id: 'global', tgChoAloSauKB: 60, tgChoNhantinSauGoiKhongNghe: 30, tgLapLichNhantinLan2: 2 },
  })

  console.log('Settings seeded')
  console.log('Seed complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
