
export const stub_getData = (code) => {
    const data = [
    {
        fio: {
            imya: 'Иван',
            familiya: 'Иванов',
            otchestvo: 'Иванович'
        },
        adres: {
            ulitsa: 'Труда',
            dom: '101',
            korpus: '',
            kvartira: '10'
        },
        nomer_ls: '0000012345',
        schetchiki: [
            {
                id: '1',
                title: 'ванная х/в',
                cur_value: 100
            },
            {
                id: '2',
                title: 'ванная г/в',
                cur_value: 85
            }
        ]
    },
    {
        fio: {
            imya: 'Петр',
            familiya: 'Петров',
            otchestvo: 'Петрович'
        },
        adres: {
            ulitsa: 'Мира',
            dom: '123',
            korpus: '',
            kvartira: '5'
        },
        nomer_ls: '0000054321',
        schetchiki: [
            {
                id: '1',
                title: 'кухня х/в',
                cur_value: 101
            },
            {
                id: '2',
                title: 'кухня г/в',
                cur_value: 79
            },
            {
                id: '3',
                title: 'ванная х/в',
                cur_value: 4
            }
        ]
    },
];
    if (code === '12345') return data[0];
    else if (code === '54321') return data[1];
    else return null;
}

