
export const stub_getData = () => {
    const data = {
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
        nomer_ls: '0000000123',
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
    };
    return data;
}

